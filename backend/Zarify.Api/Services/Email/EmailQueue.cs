using System.Threading.Channels;

namespace Zarify.Api.Services.Email;

/// Requests never wait for, or fail because of, an email: controllers drop
/// the message here and return; EmailWorker sends it in the background,
/// retrying a couple of times and logging (never throwing) on failure. This
/// also keeps "forgot password" equally fast for registered and unknown
/// addresses. The queue is in memory — a message still waiting when the
/// process stops is lost, which the log will show.
public interface IEmailQueue
{
    void Enqueue(EmailMessage message);
}

public sealed class EmailQueue(ILogger<EmailQueue> logger) : IEmailQueue
{
    private readonly Channel<EmailMessage> _channel = Channel.CreateBounded<EmailMessage>(
        new BoundedChannelOptions(1000) { FullMode = BoundedChannelFullMode.Wait, SingleReader = true });

    public ChannelReader<EmailMessage> Reader => _channel.Reader;

    public void Enqueue(EmailMessage message)
    {
        if (!_channel.Writer.TryWrite(message))
        {
            logger.LogError("Email queue full — dropped {Kind} email to {To}", message.Kind, message.To);
        }
    }
}

public sealed class EmailWorker(EmailQueue queue, IEmailSender sender, ILogger<EmailWorker> logger) : BackgroundService
{
    private static readonly TimeSpan[] RetryDelays = [TimeSpan.FromSeconds(5), TimeSpan.FromSeconds(30)];

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var message in queue.Reader.ReadAllAsync(stoppingToken))
        {
            for (var attempt = 0; ; attempt++)
            {
                try
                {
                    await sender.SendAsync(message, stoppingToken);
                    logger.LogInformation("Sent {Kind} email to {To}", message.Kind, message.To);
                    break;
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    logger.LogWarning("Shutting down — {Kind} email to {To} not sent", message.Kind, message.To);
                    return;
                }
                catch (Exception ex) when (attempt < RetryDelays.Length)
                {
                    logger.LogWarning(ex, "Sending {Kind} email to {To} failed (attempt {Attempt}); retrying",
                        message.Kind, message.To, attempt + 1);
                    await Task.Delay(RetryDelays[attempt], stoppingToken);
                }
                catch (Exception ex)
                {
                    // Body deliberately not logged: it may carry a reset link.
                    logger.LogError(ex, "Giving up on {Kind} email to {To} ({Subject})",
                        message.Kind, message.To, message.Subject);
                    break;
                }
            }
        }
    }
}

using Xmtruyen.API.Models;
using Xmtruyen.API.Models.Requests;
using Xmtruyen.API.Models.Responses;

namespace Xmtruyen.API.Services;

public interface IPaymentService
{
    Task<PaymentOrderResponse> CreateTopUpOrderAsync(Guid userId, TopUpRequest request);
    Task<PaymentOrderResponse> CreateSubscriptionOrderAsync(Guid userId, PurchaseSubscriptionRequest request);
    Task<bool> ProcessCallbackAsync(PaymentCallbackRequest request);
    Task<WalletResponse> GetWalletAsync(Guid userId);
    Task<Transaction> CreateManualTopUpAsync(ManualTopUpRequest request);
}

using XomTruyen.API.Models;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Models.Responses;

namespace XomTruyen.API.Services;

public interface IPaymentService
{
    Task<PaymentOrderResponse> CreateTopUpOrderAsync(Guid userId, TopUpRequest request);
    Task<PaymentOrderResponse> CreateSubscriptionOrderAsync(Guid userId, PurchaseSubscriptionRequest request);
    Task<bool> ProcessCallbackAsync(PaymentCallbackRequest request);
    Task<WalletResponse> GetWalletAsync(Guid userId);
    Task<Transaction> CreateManualTopUpAsync(ManualTopUpRequest request);
}

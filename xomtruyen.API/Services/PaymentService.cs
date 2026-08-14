using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Models.Responses;

namespace XomTruyen.API.Services;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _context;
    
    // Suggestion: Inject configuration for MoMo/VNPay here later.
    
    public PaymentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaymentOrderResponse> CreateTopUpOrderAsync(Guid userId, TopUpRequest request)
    {
        // Define packages manually for now, or fetch from DB if needed
        int coinAmount = 0;
        int price = 0;
        switch (request.PackageId)
        {
            case "pack_50": coinAmount = 50; price = 10000; break;
            case "pack_120": coinAmount = 120; price = 20000; break;
            case "pack_350": coinAmount = 350; price = 50000; break;
            case "pack_800": coinAmount = 800; price = 100000; break;
            default: throw new ArgumentException("Invalid package ID");
        }

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Amount = price,
            CoinAmount = coinAmount,
            TransactionType = "TopUp",
            Status = "Pending",
            PaymentMethod = request.PaymentMethod,
            CreatedAt = DateTime.UtcNow
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        if (request.PaymentMethod == "Manual")
        {
            return new PaymentOrderResponse
            {
                OrderId = transaction.Id.ToString(),
                Message = "Order created. Please wait for admin approval after manual transfer."
            };
        }

        // Mock payment URL for MoMo/VNPay since we don't have real credentials yet
        return new PaymentOrderResponse
        {
            OrderId = transaction.Id.ToString(),
            PaymentUrl = $"https://mock-payment-gateway.com/pay?orderId={transaction.Id}&amount={price}",
            Message = "Redirect to payment gateway"
        };
    }

    public async Task<PaymentOrderResponse> CreateSubscriptionOrderAsync(Guid userId, PurchaseSubscriptionRequest request)
    {
        var plan = await _context.SubscriptionPlans.FindAsync(request.PlanId);
        if (plan == null) throw new ArgumentException("Invalid plan ID");

        // If paying with Coin
        if (request.PaymentMethod == "Coin")
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("User not found");
            
            // Assume 1 coin = 1000 VND for simplicity, or define specific coin prices for plans
            int coinPrice = plan.Price / 1000; // e.g. 59,000 VND -> 59 coins
            
            if ((user.CoinBalance ?? 0) < coinPrice)
                throw new Exception("Not enough coins");

            user.CoinBalance -= coinPrice;
            
            // Activate plan
            user.CurrentPlanId = plan.Id;
            user.PlanExpiredAt = DateTime.UtcNow.AddDays(plan.DurationDays);

            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Amount = plan.Price,
                CoinAmount = -coinPrice,
                TransactionType = "Subscription",
                Status = "Completed",
                PaymentMethod = "Coin",
                SubscriptionPlanId = plan.Id,
                CompletedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };
            
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
            
            return new PaymentOrderResponse
            {
                OrderId = transaction.Id.ToString(),
                Message = "Subscription activated using coins."
            };
        }

        // For MoMo/VNPay
        var tx = new Transaction
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Amount = plan.Price,
            TransactionType = "Subscription",
            Status = "Pending",
            PaymentMethod = request.PaymentMethod,
            SubscriptionPlanId = plan.Id,
            CreatedAt = DateTime.UtcNow
        };

        _context.Transactions.Add(tx);
        await _context.SaveChangesAsync();

        return new PaymentOrderResponse
        {
            OrderId = tx.Id.ToString(),
            PaymentUrl = $"https://mock-payment-gateway.com/pay?orderId={tx.Id}&amount={plan.Price}",
            Message = "Redirect to payment gateway"
        };
    }

    public async Task<bool> ProcessCallbackAsync(PaymentCallbackRequest request)
    {
        // Mock processing logic
        // Verify signature here in real implementation

        if (string.IsNullOrEmpty(request.OrderId)) return false;

        if (Guid.TryParse(request.OrderId, out Guid transactionId))
        {
            var transaction = await _context.Transactions.Include(t => t.User).FirstOrDefaultAsync(t => t.Id == transactionId);
            if (transaction == null || transaction.Status == "Completed") return false;

            if (request.ResultCode == 0) // Success
            {
                transaction.Status = "Completed";
                transaction.ExternalTransactionId = request.TransId.ToString();
                transaction.CompletedAt = DateTime.UtcNow;

                if (transaction.TransactionType == "TopUp" && transaction.CoinAmount.HasValue)
                {
                    transaction.User!.CoinBalance = (transaction.User.CoinBalance ?? 0) + transaction.CoinAmount.Value;
                }
                else if (transaction.TransactionType == "Subscription" && transaction.SubscriptionPlanId.HasValue)
                {
                    var plan = await _context.SubscriptionPlans.FindAsync(transaction.SubscriptionPlanId.Value);
                    if (plan != null)
                    {
                        transaction.User!.CurrentPlanId = plan.Id;
                        transaction.User.PlanExpiredAt = DateTime.UtcNow.AddDays(plan.DurationDays);
                    }
                }

                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                transaction.Status = "Failed";
                await _context.SaveChangesAsync();
                return false;
            }
        }
        return false;
    }

    public async Task<WalletResponse> GetWalletAsync(Guid userId)
    {
        var user = await _context.Users
            .Include(u => u.CurrentPlan)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) throw new Exception("User not found");

        return new WalletResponse
        {
            CoinBalance = user.CoinBalance ?? 0,
            CurrentPlanId = user.CurrentPlanId,
            PlanName = user.CurrentPlan?.Name,
            PlanExpiredAt = user.PlanExpiredAt,
            IsUnlimited = user.CurrentPlan?.IsUnlimited ?? false
        };
    }

    public async Task<Transaction> CreateManualTopUpAsync(ManualTopUpRequest request)
    {
        var user = await _context.Users.FindAsync(request.UserId);
        if (user == null) throw new Exception("User not found");

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            Amount = 0, // Admin manual top-up, money is handled outside
            CoinAmount = request.CoinAmount,
            TransactionType = "TopUp",
            Status = "Completed",
            PaymentMethod = "Manual",
            Note = request.Note,
            CompletedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };

        user.CoinBalance = (user.CoinBalance ?? 0) + request.CoinAmount;

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return transaction;
    }
}

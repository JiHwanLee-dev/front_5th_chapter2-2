import React from "react";

interface SummaryProps {
    totals: {
        totalBeforeDiscount: number;
        totalAfterDiscount: number;
        totalDiscount: number;
    };
}

const OrderSummary = ({ totals }: SummaryProps) => {
    return (
        <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">주문 요약</h2>
            <div className="space-y-1">
                <p>
                    상품 금액: {totals.totalBeforeDiscount.toLocaleString()}원
                </p>
                <p className="text-green-600">
                    할인 금액: {totals.totalDiscount.toLocaleString()}원
                </p>
                <p className="text-xl font-bold">
                    최종 결제 금액: {totals.totalAfterDiscount.toLocaleString()}
                    원
                </p>
            </div>
        </div>
    );
};

export default OrderSummary;

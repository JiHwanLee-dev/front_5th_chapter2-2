import { useState } from "react";
import { Coupon, Discount, Product } from "../../../types.ts";

import DiscountManager from "./ProductManagement/DiscountManager.tsx";
import ProductNameInput from "./ProductManagement/ProductNameInput.tsx";
import ProductPriceInput from "./ProductManagement/ProductPriceInput.tsx";
import ProductStockInput from "./ProductManagement/ProductStockInput.tsx";

import { ProductNameHandler } from "./ProductManagement/ProductNameHandler.ts";
import { ProductPriceHandler } from "./ProductManagement/ProductPriceHandler.ts";
import { ProductStockHandler } from "./ProductManagement/ProductStockHandlers.ts";

// const { editingProduct, setEditingProduct, handleProductNameUpdate } =
//     useProductNameHandler();

interface Props {
    products: Product[];
    coupons: Coupon[];
    onProductUpdate: (updatedProduct: Product) => void;
    onProductAdd: (newProduct: Product) => void;
    onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({
    products,
    coupons,
    onProductUpdate,
    onProductAdd,
    onCouponAdd,
}: Props) => {
    const [openProductIds, setOpenProductIds] = useState<Set<string>>(
        new Set()
    );
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [newDiscount, setNewDiscount] = useState<Discount>({
        quantity: 0,
        rate: 0,
    });
    const [newCoupon, setNewCoupon] = useState<Coupon>({
        name: "",
        code: "",
        discountType: "percentage",
        discountValue: 0,
    });
    const [showNewProductForm, setShowNewProductForm] = useState(false);
    const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
        name: "",
        price: 0,
        stock: 0,
        discounts: [],
    });

    const { handleProductNameUpdate } = ProductNameHandler(
        editingProduct,
        setEditingProduct
    );
    const { handlePriceUpdate } = ProductPriceHandler(
        editingProduct,
        setEditingProduct
    );
    const { handleStockUpdate } = ProductStockHandler(
        products,
        setEditingProduct,
        onProductUpdate
    );

    // 상품 클릭 시
    const toggleProductAccordion = (productId: string) => {
        console.log("toggleProductAccordion click");
        setOpenProductIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    // handleEditProduct 함수 수정
    const handleEditProduct = (product: Product) => {
        setEditingProduct({ ...product });
    };

    // 수정 완료 핸들러 함수 추가
    const handleEditComplete = () => {
        if (editingProduct) {
            onProductUpdate(editingProduct);
            setEditingProduct(null);
        }
    };

    // const handleStockUpdate = (productId: string, newStock: number) => {
    //     const updatedProduct = products.find((p) => p.id === productId);
    //     if (updatedProduct) {
    //         const newProduct = { ...updatedProduct, stock: newStock };
    //         onProductUpdate(newProduct);
    //         setEditingProduct(newProduct);
    //     }
    // };

    const handleAddDiscount = (productId: string) => {
        const updatedProduct = products.find((p) => p.id === productId);
        if (updatedProduct && editingProduct) {
            const newProduct = {
                ...updatedProduct,
                discounts: [...updatedProduct.discounts, newDiscount],
            };
            onProductUpdate(newProduct);
            setEditingProduct(newProduct);
            setNewDiscount({ quantity: 0, rate: 0 });
        }
    };

    const handleRemoveDiscount = (productId: string, index: number) => {
        const updatedProduct = products.find((p) => p.id === productId);
        if (updatedProduct) {
            const newProduct = {
                ...updatedProduct,
                discounts: updatedProduct.discounts.filter(
                    (_, i) => i !== index
                ),
            };
            onProductUpdate(newProduct);
            setEditingProduct(newProduct);
        }
    };

    const handleAddCoupon = () => {
        onCouponAdd(newCoupon);
        setNewCoupon({
            name: "",
            code: "",
            discountType: "percentage",
            discountValue: 0,
        });
    };

    const handleAddNewProduct = () => {
        const productWithId = { ...newProduct, id: Date.now().toString() };
        onProductAdd(productWithId);
        setNewProduct({
            name: "",
            price: 0,
            stock: 0,
            discounts: [],
        });
        setShowNewProductForm(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
                    <button
                        onClick={() =>
                            setShowNewProductForm(!showNewProductForm)
                        }
                        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
                    >
                        {showNewProductForm ? "취소" : "새 상품 추가"}
                    </button>
                    {showNewProductForm && (
                        <div className="bg-white p-4 rounded shadow mb-4">
                            <h3 className="text-xl font-semibold mb-2">
                                새 상품 추가
                            </h3>
                            <div className="mb-2">
                                <label
                                    htmlFor="productName"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    상품명
                                </label>
                                <input
                                    id="productName"
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-2">
                                <label
                                    htmlFor="productPrice"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    가격
                                </label>
                                <input
                                    id="productPrice"
                                    type="number"
                                    value={newProduct.price}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            price: parseInt(e.target.value),
                                        })
                                    }
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-2">
                                <label
                                    htmlFor="productStock"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    재고
                                </label>
                                <input
                                    id="productStock"
                                    type="number"
                                    value={newProduct.stock}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            stock: parseInt(e.target.value),
                                        })
                                    }
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <button
                                onClick={handleAddNewProduct}
                                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            >
                                추가
                            </button>
                        </div>
                    )}
                    {/* 상품 목록 <ProductList products={products} openProductIds={openProductIds} setOpenProductIds={setOpenProductIds}   /> */}
                    <div className="space-y-2">
                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                data-testid={`product-${index + 1}`}
                                className="bg-white p-4 rounded shadow"
                            >
                                <button
                                    data-testid="toggle-button"
                                    onClick={() =>
                                        toggleProductAccordion(product.id)
                                    }
                                    className="w-full text-left font-semibold"
                                >
                                    {product.name} - {product.price}원 (재고:{" "}
                                    {product.stock})
                                </button>
                                {openProductIds.has(product.id) && (
                                    <div className="mt-2">
                                        {editingProduct &&
                                        editingProduct.id === product.id ? (
                                            <div>
                                                <ProductNameInput
                                                    productId={product.id}
                                                    productName={
                                                        editingProduct.name
                                                    }
                                                    onNameUpdate={
                                                        handleProductNameUpdate
                                                    }
                                                />

                                                <ProductPriceInput
                                                    productId={product.id}
                                                    price={editingProduct.price}
                                                    onPriceUpdate={
                                                        handlePriceUpdate
                                                    }
                                                />

                                                <ProductStockInput
                                                    productId={product.id}
                                                    stock={editingProduct.stock}
                                                    onStockUpdate={
                                                        handleStockUpdate
                                                    }
                                                />

                                                {/* 할인 정보 수정 부분 */}
                                                <DiscountManager
                                                    product={product}
                                                    editingProduct={
                                                        editingProduct
                                                    }
                                                    newDiscount={newDiscount}
                                                    setNewDiscount={
                                                        setNewDiscount
                                                    }
                                                    onAddDiscount={
                                                        handleAddDiscount
                                                    }
                                                    onRemoveDiscount={
                                                        handleRemoveDiscount
                                                    }
                                                />
                                                <button
                                                    onClick={handleEditComplete}
                                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
                                                >
                                                    수정 완료
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                {product.discounts.map(
                                                    (discount, index) => (
                                                        <div
                                                            key={index}
                                                            className="mb-2"
                                                        >
                                                            <span>
                                                                {
                                                                    discount.quantity
                                                                }
                                                                개 이상 구매 시{" "}
                                                                {discount.rate *
                                                                    100}
                                                                % 할인
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                                <button
                                                    data-testid="modify-button"
                                                    onClick={() =>
                                                        handleEditProduct(
                                                            product
                                                        )
                                                    }
                                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
                                                >
                                                    수정
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
                    <div className="bg-white p-4 rounded shadow">
                        <div className="space-y-2 mb-4">
                            <input
                                type="text"
                                placeholder="쿠폰 이름"
                                value={newCoupon.name}
                                onChange={(e) =>
                                    setNewCoupon({
                                        ...newCoupon,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="쿠폰 코드"
                                value={newCoupon.code}
                                onChange={(e) =>
                                    setNewCoupon({
                                        ...newCoupon,
                                        code: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded"
                            />
                            <div className="flex gap-2">
                                <select
                                    value={newCoupon.discountType}
                                    onChange={(e) =>
                                        setNewCoupon({
                                            ...newCoupon,
                                            discountType: e.target.value as
                                                | "amount"
                                                | "percentage",
                                        })
                                    }
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="amount">금액(원)</option>
                                    <option value="percentage">
                                        할인율(%)
                                    </option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="할인 값"
                                    value={newCoupon.discountValue}
                                    onChange={(e) =>
                                        setNewCoupon({
                                            ...newCoupon,
                                            discountValue: parseInt(
                                                e.target.value
                                            ),
                                        })
                                    }
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <button
                                onClick={handleAddCoupon}
                                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                            >
                                쿠폰 추가
                            </button>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                현재 쿠폰 목록
                            </h3>
                            <div className="space-y-2">
                                {coupons.map((coupon, index) => (
                                    <div
                                        key={index}
                                        data-testid={`coupon-${index + 1}`}
                                        className="bg-gray-100 p-2 rounded"
                                    >
                                        {coupon.name} ({coupon.code}):
                                        {coupon.discountType === "amount"
                                            ? `${coupon.discountValue}원`
                                            : `${coupon.discountValue}%`}{" "}
                                        할인
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

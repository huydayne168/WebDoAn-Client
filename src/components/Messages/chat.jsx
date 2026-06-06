import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./chat.css";

const PRODUCT_API_URL = "/api/getallsp";
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const quickSuggestions = [
    "Quán hiện có những món ăn Ý đặc trưng nào vậy?",
    "Ở quán có loại pizza nào được khách gọi nhiều nhất?",
    "Bạn có thể giới thiệu giúp tôi những loại pasta/mì Ý mà quán đang phục vụ không?",
    "Tôi muốn biết thêm về các món tráng miệng Ý tại quán, bạn có thể gợi ý cho tôi không?",
];

const generateContextText = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
        return "Không có sản phẩm nào.";
    }

    return data
        .map((product, index) => {
            const name = product.ten_san_pham || `Sản phẩm #${index + 1}`;
            const desc = product.mo_ta || "Không có mô tả";
            const price = product.gia
                ? `${Number(product.gia).toLocaleString("vi-VN")} VND`
                : "Chưa có giá";
            const quantity = product.soluong
                ? `Số lượng: ${product.soluong}`
                : "";
            const sale = product.sale ? `Khuyến mãi: ${product.sale}` : "";
            const notice = product.thongbao
                ? `Thông báo: ${product.thongbao}`
                : "";

            return `- ${name}:\n  Mô tả: ${desc}\n  Giá: ${price}\n  ${quantity}\n  ${sale}\n  ${notice}`;
        })
        .join("\n\n");
};

const removeAsterisks = (text = "") => text.replace(/\*/g, "").trim();

const ChatAIApp = () => {
    const [chats, setChats] = useState(() => {
        const savedChats = localStorage.getItem("ai-saved-chats");
        return savedChats ? JSON.parse(savedChats) : [];
    });
    const [products, setProducts] = useState([]);
    const [theme, setTheme] = useState(
        () => localStorage.getItem("ai-themeColor") || "dark_mode",
    );
    const [userMessage, setUserMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await axios.get(PRODUCT_API_URL);
                setProducts(response.data);
            } catch (error) {
                setProducts([]);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        localStorage.setItem("ai-saved-chats", JSON.stringify(chats));
    }, [chats]);

    useEffect(() => {
        localStorage.setItem("ai-themeColor", theme);
        document.body.classList.toggle("light_mode", theme === "light_mode");
    }, [theme]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats, isLoading]);

    const handleSendMessage = async (message) => {
        const text = message.trim();
        if (!text || isLoading) return;

        setChats((prevChats) => [
            ...prevChats,
            { text, type: "outgoing" },
        ]);
        setUserMessage("");
        setShowSuggestions(false);
        setIsLoading(true);

        try {
            if (!API_KEY) {
                throw new Error("Missing Gemini API key");
            }

            const contextText = generateContextText(products);
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: `Dưới đây là danh sách các sản phẩm hiện có:\n${contextText}\n\nHãy sử dụng thông tin này để trả lời câu hỏi tiếp theo khi khách hàng hỏi về sản phẩm.`,
                                },
                            ],
                        },
                        {
                            role: "user",
                            parts: [{ text }],
                        },
                    ],
                }),
            });

            const resData = await response.json();
            const aiMessage =
                removeAsterisks(
                    resData?.candidates?.[0]?.content?.parts?.[0]?.text,
                ) || "Lỗi phản hồi từ AI.";

            setChats((prevChats) => [
                ...prevChats,
                { text: aiMessage, type: "incoming" },
            ]);
        } catch (error) {
            setChats((prevChats) => [
                ...prevChats,
                {
                    text: "Không thể phản hồi, vui lòng thử lại.",
                    type: "incoming",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (text) => {
        handleSendMessage(text);
    };

    const toggleTheme = () => {
        setTheme((prevTheme) =>
            prevTheme === "dark_mode" ? "light_mode" : "dark_mode",
        );
    };

    const deleteAllChats = () => {
        if (
            window.confirm(
                "Bạn có chắc chắn muốn xóa toàn bộ lịch sử chat?",
            )
        ) {
            setShowSuggestions(true);
            setChats([]);
            localStorage.removeItem("ai-saved-chats");
        }
    };

    return (
        <main id="ai-chat">
            <section className="ai-all">
                <div className="ai-shell">
                    <header className="ai-panel-header">
                        <div>
                            <span className="ai-eyebrow">
                                Gemini assistant
                            </span>
                            <h1>Chat tư vấn món ăn</h1>
                            <p>
                                Hỏi nhanh về món ăn, giá bán và gợi ý phù hợp
                                với thực đơn hiện có.
                            </p>
                        </div>

                        <div className="ai-header-actions">
                            <button
                                type="button"
                                className="ai-header-button material-symbols-rounded"
                                onClick={toggleTheme}
                                aria-label="Đổi giao diện"
                                title="Đổi giao diện"
                            >
                                {theme === "dark_mode"
                                    ? "light_mode"
                                    : "dark_mode"}
                            </button>
                            <button
                                type="button"
                                className="ai-header-button material-symbols-rounded"
                                onClick={deleteAllChats}
                                aria-label="Xóa lịch sử chat"
                                title="Xóa lịch sử chat"
                            >
                                delete
                            </button>
                        </div>
                    </header>

                    {showSuggestions && (
                        <div className="ai-suggestion-list">
                            {quickSuggestions.map((suggestion, index) => (
                                <button
                                    type="button"
                                    key={suggestion}
                                    className="ai-suggestion"
                                    onClick={() =>
                                        handleSuggestionClick(suggestion)
                                    }
                                >
                                    <span className="ai-suggestion-index">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="ai-text">
                                        {suggestion}
                                    </span>
                                    <span className="ai-icon material-symbols-rounded">
                                        arrow_forward
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="ai-chat-list">
                        {chats.length === 0 && !isLoading && (
                            <div className="ai-empty-state">
                                <span className="material-symbols-rounded">
                                    restaurant_menu
                                </span>
                                <h2>Bắt đầu một cuộc trò chuyện</h2>
                                <p>
                                    Gemini sẽ dùng dữ liệu sản phẩm trong hệ
                                    thống để trả lời cho khách.
                                </p>
                            </div>
                        )}

                        <div className="ai-chat-grid">
                            {chats.map((chat, index) => (
                                <div
                                    key={`${chat.type}-${index}`}
                                    className={`ai-message ${chat.type}`}
                                >
                                    <div className="ai-message-content">
                                        <img
                                            className="ai-avatar"
                                            src={
                                                chat.type === "outgoing"
                                                    ? "https://img.icons8.com/?size=100&id=ScJCfhkd77yD&format=png&color=000000"
                                                    : "https://img.icons8.com/?size=100&id=kTuxVYRKeKEY&format=png&color=000000"
                                            }
                                            alt={
                                                chat.type === "outgoing"
                                                    ? "User avatar"
                                                    : "AI avatar"
                                            }
                                        />
                                        <div className="ai-bubble">
                                            <p className="ai-text">
                                                {chat.text}
                                            </p>
                                            {chat.type === "incoming" && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(
                                                            chat.text,
                                                        )
                                                    }
                                                    className="ai-copy-button material-symbols-rounded"
                                                    aria-label="Sao chép phản hồi"
                                                    title="Sao chép"
                                                >
                                                    content_copy
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="ai-message incoming">
                                    <div className="ai-message-content">
                                        <img
                                            className="ai-avatar"
                                            src="https://img.icons8.com/?size=100&id=kTuxVYRKeKEY&format=png&color=000000"
                                            alt="AI avatar"
                                        />
                                        <div className="ai-bubble ai-typing-bubble">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef}></div>
                        </div>
                    </div>

                    <form
                        className="ai-typing-form"
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleSendMessage(userMessage);
                        }}
                    >
                        <div className="ai-input-wrapper">
                            <input
                                type="text"
                                placeholder="Nhập câu hỏi của bạn..."
                                className="ai-typing-input"
                                value={userMessage}
                                onChange={(event) =>
                                    setUserMessage(event.target.value)
                                }
                                required
                            />
                            <button
                                type="submit"
                                id="send-ai-message-button"
                                className="material-symbols-rounded"
                                disabled={isLoading}
                                aria-label="Gửi tin nhắn"
                            >
                                send
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default ChatAIApp;

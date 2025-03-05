import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { ethers } from "ethers";

async function sendTransaction() {
    try {
        // 1. Создаём WalletConnect соединение
        const connector = new WalletConnect({
            bridge: "https://bridge.walletconnect.org", // WalletConnect сервер
        });

        // 2. Показываем QR-код для подключения кошелька
        if (!connector.connected) {
            await connector.createSession();
            QRCodeModal.open(connector.uri, () => {
                console.log("QR Code Modal Closed");
            });
        }

        // 3. Ждём подключения пользователя
        connector.on("connect", async (error, payload) => {
            if (error) {
                throw error;
            }

            // Получаем адрес пользователя
            const { accounts } = payload.params[0];
            const userAddress = accounts[0];

            // 4. Формируем транзакцию
            const contractAddress = "0x576F89f42e6e4D38C9EEdd593368984ABaBf5cf0";
            const abi = ["function claimNFT()"];
            const iface = new ethers.utils.Interface(abi);
            const data = iface.encodeFunctionData("claimNFT", []);

            const tx = {
                from: userAddress,
                to: contractAddress,
                data: data,
                gas: "300000", // Указываем лимит газа
            };

            // 5. Отправляем транзакцию
            const result = await connector.sendTransaction(tx);
            console.log("Transaction Hash:", result);
            alert("NFT успешно запрошен! Транзакция: " + result);
        });
    } catch (err) {
        console.error("Error:", err);
        alert("Ошибка транзакции!");
    }
}

// Запуск при клике на кнопку
document.getElementById("claimButton").addEventListener("click", function() {
    console.log("Button clicked");
    sendTransaction();
});

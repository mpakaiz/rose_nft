// Проверим, доступна ли библиотека WalletConnect
if (typeof WalletConnectClient === "undefined") {
    console.error("WalletConnect is not defined. Please check the CDN link.");
} else {
    // Создаем экземпляр Web3 для взаимодействия с Ethereum
    let web3;
    let connector;

    // Настройка WalletConnect (новая версия API)
    connector = new WalletConnectClient({
        bridge: "https://bridge.walletconnect.org", // Пример серверного URL
    });

    // Функция для подключения кошелька
    async function connectWallet() {
        try {
            if (!connector.connected) {
                await connector.createSession();
                const uri = connector.uri;
                QRCodeModal.open(uri, () => {
                    console.log("QR Code Modal Closed");
                });
            }

            // Получим адреса аккаунтов пользователя
            connector.on("connect", async (error, payload) => {
                if (error) {
                    throw error;
                }

                const { accounts } = payload.params[0];
                const userAddress = accounts[0];
                console.log("User Address: ", userAddress);

                // Покажем кнопку для claim NFT
                document.getElementById("claimButton").style.display = "block";
                document.getElementById("connectButton").style.display = "none";
            });
        } catch (error) {
            console.error("Connection error:", error);
            alert("Ошибка при подключении кошелька!");
        }
    }

    // Функция для запроса NFT
    async function claimNFT() {
        try {
            const accounts = await connector.getAccounts();
            const userAddress = accounts[0];

            const contractAddress = "0x576F89f42e6e4D38C9EEdd593368984ABaBf5cf0"; // Адрес контракта
            const abi = [
                {
                    "constant": false,
                    "inputs": [],
                    "name": "claimNFT",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ];

            const contract = new web3.eth.Contract(abi, contractAddress);

            // Отправка транзакции
            const result = await contract.methods.claimNFT().send({ from: userAddress });
            alert("NFT успешно запрашивается! Транзакция: " + result.transactionHash);
        } catch (err) {
            console.error("Ошибка при выполнении транзакции:", err);
            alert("Ошибка при запросе NFT.");
        }
    }

    // Прикрепляем события к кнопкам
    document.getElementById("connectButton").addEventListener("click", connectWallet);
    document.getElementById("claimButton").addEventListener("click", claimNFT);
}

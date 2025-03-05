// Проверим, доступна ли библиотека WalletLink
if (typeof WalletLink === "undefined") {
    console.error("WalletLink is not defined. Please check the CDN link.");
} else {
    // Создаем экземпляр Web3 для взаимодействия с Ethereum
    let web3;
    let walletLinkProvider;

    // Настройка WalletLink
    const walletLink = new WalletLink({
        appName: "NFT Claim App", // Название вашего приложения
        appLogoUrl: "https://yourapp.com/logo.png", // Логотип приложения
        darkMode: false, // Темная тема или светлая
    });

    // Настроим провайдер для подключения через WalletLink
    walletLinkProvider = walletLink.makeWeb3Provider(
        "https://mainnet.infura.io/v3/YOUR_INFURA_ID", // Используем Infura для подключения
        1 // ID сети (1 - Ethereum Mainnet)
    );

    // Инициализация Web3 с провайдером WalletLink
    web3 = new Web3(walletLinkProvider);

    // Функция для подключения кошелька
    async function connectWallet() {
        try {
            // Запросим аккаунты пользователя
            const accounts = await web3.eth.requestAccounts();
            const userAddress = accounts[0];

            console.log("User Address: ", userAddress);

            // Покажем кнопку для claim NFT
            document.getElementById("claimButton").style.display = "block";
            document.getElementById("connectButton").style.display = "none";
        } catch (error) {
            console.error("Connection error:", error);
            alert("Ошибка при подключении кошелька!");
        }
    }

    // Функция для запроса NFT
    async function claimNFT() {
        try {
            const accounts = await web3.eth.getAccounts();
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

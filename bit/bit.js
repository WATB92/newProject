// 버블 데이터를 가져오는 함수
async function fetchData() {
    // 예: API 호출하여 실시간 데이터를 가져올 수 있음
    // const response = await fetch("https://api.crypto.com/prices");
    // return await response.json();

    // 임시 데이터
    return [
        { symbol: "BTC", price: 50000, change: 5 },
        { symbol: "ETH", price: 4000, change: -3 },
        { symbol: "ADA", price: 1.2, change: 10 },
        { symbol: "SOL", price: 150, change: -2 },
        { symbol: "DOGE", price: 0.3, change: 20 },
    ];
}

// 버블을 생성하는 함수
function createBubble(data) {
    const container = document.getElementById("bubble-container");
    const bubbles = [];
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    data.forEach(coin => {
        const bubble = document.createElement("div");
        const size = Math.max(50, coin.price / 100); // 가격에 비례한 크기
        const color = coin.change > 0 ? "rgba(0, 200, 0, 0.7)" : "rgba(200, 0, 0, 0.7)";

        // 스타일 지정
        bubble.className = "bubble";
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.backgroundColor = color;
        bubble.innerHTML = `
            <strong>${coin.symbol}</strong>
            <br>${coin.change > 0 ? "+" : ""}${coin.change}%
        `;

        // 버블 위치 계산
        let x, y;
        let overlap;
        const maxAttempts = 100; // 최대 시도 횟수
        let attempts = 0;

        do {
            overlap = false;
            x = Math.random() * (containerWidth - size);
            y = Math.random() * (containerHeight - size);

            // 다른 버블과 겹치는지 확인
            for (let otherBubble of bubbles) {
                const dx = x - otherBubble.x;
                const dy = y - otherBubble.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < (size + otherBubble.size) / 2) {
                    overlap = true;
                    break;
                }
            }

            attempts++;
        } while (overlap && attempts < maxAttempts);

        // 최종 위치 설정
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;

        // 버블 정보를 저장
        bubbles.push({ x, y, size });
        container.appendChild(bubble);
    });
}

// 초기화 함수
async function init() {
    const data = await fetchData();
    createBubble(data);
}

// 실행
init();

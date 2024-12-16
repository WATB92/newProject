const basketCont = document.querySelector("#basketCont");
const totalPriceB = document.querySelector("#totalPriceB");
const loadBasketsBtn = document.querySelector("#loadBasketsBtn");
const basketEx = document.querySelector("#basketEx")
let basketsObj = {};

const submitHandeler = function (e) {
    e.preventDefault();
}
const printBasketsObj=()=>{
    basketCont.innerHTML = "";
    for (let num in basketsObj) {
        if(isNaN(num)) continue; 
        let basket = basketsObj[num];
        let tr = basketEx.cloneNode(true);
        tr.removeAttribute("id")
        for (let key in basket) {
            let td = tr.querySelector("." + key);
            td.append(document.createTextNode(basket[key]));
        }
        basketCont.append(tr);
    }
    totalPriceB.innerText = basketsObj["total"];
}

//비동기식으로 장바구니 내역을 받아오는 함수
const loadBasketsFunc = () => {
    const req = new XMLHttpRequest();
    req.open("GET", "./l19baskets.json");
    req.send();
    req.onload = () => {
        if (req.status !== 200) {
            alert("장바구니 요청에 실패했습니다.");
            return;
        }
        basketsObj = JSON.parse(req.responseText);
        for (let num in basketsObj) {
            //if(num==="total") continue;
            if(isNaN(num)) continue; //break : 반복문 전체를 멈추는 것, continue 반복문의 해당 구문만 넘기는 것
            let basket = basketsObj[num];
            delete basketsObj[num];
            num = Number(num);
            basketsObj[num] = basket;
            //정렬을 위해 key 를 수로 바꾸는 중
        }
        printBasketsObj();
    }
}
loadBasketsBtn.onclick = loadBasketsFunc;




const loadProductsBtn = document.getElementById("loadProductsBtn");
const productList = document.getElementById("productList");
const productEx = document.getElementById("productEx");
const loadProducts = () => {
    const req = new XMLHttpRequest();
    req.open("GET", "./l18products.json");
    req.send();
    req.onload = () => {
        if (req.status !== 200) {
            alert("데이터를 불러오는데 실패! 다시시도!");
            return;
        }
        let products = JSON.parse(req.responseText);
        products.forEach((p) => {
            let ex = productEx.cloneNode(true);
            ex.removeAttribute("id");
            for (let key in p) {
                let node = ex.querySelector("." + key);
                let form = ex.querySelector(".basketForm");
                if (key === "img[src]") {
                    node.src = p[key];
                } else {
                    node?.append(document.createTextNode(p[key]))
                    form[key].value = p[key];
                }
                form.onsubmit = submitHandeler;
            }
            productList.append(ex);
        });
    }

}
loadProductsBtn.onclick = loadProducts;

loadProducts();
loadBasketsFunc();


function goToPage(typeValue) {
    const lastInput = document.getElementById("lastName") || document.querySelector("[placeholder='你的姓氏']");
    const firstInput = document.getElementById("firstName") || document.querySelector("[placeholder='你的名字']");

    if (!lastInput || !firstInput) {
        alert("系統偵測錯誤，找不到輸入欄位！");
        return;
    }

    const lastname = lastInput.value.trim();
    const firstname = firstInput.value.trim();

    if (lastname === "" || firstname === "") {
        alert("請先輸入您的姓氏與名字！");
        return;
    }

    const encodedLast = encodeURIComponent(lastname);
    const encodedFirst = encodeURIComponent(firstname);
    const encodedType = encodeURIComponent(typeValue);

    window.location.href = `result.html?last=${encodedLast}&first=${encodedFirst}&type=${encodedType}`;
}

document.addEventListener("DOMContentLoaded", function() {
    const enterBtn = document.getElementById("enterbtn");
    if (enterBtn) {
        enterBtn.addEventListener("click", function(e) {
            if (e) e.preventDefault();
            const lastInput = document.getElementById("lastName");
            const firstInput = document.getElementById("firstName");
            if (lastInput && firstInput && lastInput.value.trim() !== "" && firstInput.value.trim() !== "") {
                alert("請點選下方卡片按鈕（天格、人格等）查看對應的分析結果！");
            } else {
                alert("請先輸入您的姓氏與名字！");
            }
        });
    }
});
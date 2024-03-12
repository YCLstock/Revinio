document.addEventListener('vueRendered', function() {
    // 在 Vue 渲染完畢後執行你的程式碼
    // ...

    console.log("測試成功")

    var star_rate = document.querySelectorAll('.wrap');
    console.log("confirm star",document.querySelector('.textarea'))
    console.log("目前畫面上的所有 DOM 元素：", document.querySelectorAll('.containerforcomment'));

});

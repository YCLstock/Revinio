    function drag(){

    const dragBox = document.querySelector('#drag-box');
    const middle = document.querySelector('#drag-area');
    const right = document.querySelector('.section-3');
    const space_svg = document.querySelector('#space_svg');
    const down = document.querySelector('.sub-section-1-1');

    let dragBoxPosition = dragBox.getBoundingClientRect();
    let dragBoxTop = dragBoxPosition.top;

    let isDragging = false;
    let startY;
    let startScrollTop;

    let scale;
    

    const middleHeight = middle.getBoundingClientRect().height;
    const dragBoxHeight = dragBox.getBoundingClientRect().height;
    const downHeight = down.getBoundingClientRect().height;

    const rightHeight = space_svg.getBoundingClientRect().height;
    const scroll_Height = right.clientHeight;                                  //猜測一樣長
    console.log(space_svg);
    console.log(space_svg.getBoundingClientRect().height);

    right.addEventListener('scroll', function() {                           //右邊同步中間
      scale = (rightHeight-scroll_Height)/(middleHeight-dragBoxHeight);         //設定變化量
      const scrollPosition = (right.scrollTop)/scale+downHeight;
      dragBox.style.top = `${scrollPosition}px`;
    });


    dragBox.addEventListener('mousedown', function(e) {
      isDragging = true;
      startY = e.clientY;
      startScrollTop = right.scrollTop;
      dragBoxPosition = dragBox.getBoundingClientRect();
      scale = (rightHeight-scroll_Height)/(middleHeight-dragBoxHeight);         //設定變化量
      // console.log("right",rightHeight," middle" ,middleHeight,"scale",scale );
      // console.log("clientheight : ",right.clientHeight,"scrollH : ",right.scrollHeight,"bottom :",scrollBottom,"TOp : ",right.scrollTop);
    });

    dragBox.addEventListener('mousemove', function(e) {
      if (isDragging) {
        dragBoxTop = dragBoxPosition.top;
        const deltaY = e.clientY - startY;
        let real_pos = Math.min(Math.max(0+downHeight,deltaY+dragBoxTop),middleHeight-dragBoxHeight+downHeight);   //限制拖曳框範圍

        // console.log("真的",real_pos);
        dragBox.style.top = `${real_pos}px`;
        // console.log("最大",middleHeight-dragBoxHeight)
        // console.log("中間",middleHeight)
        // console.log("高度",dragBoxHeight)
        right.scrollTop = startScrollTop + deltaY*scale;
        // console.log("滾輪移動頂部",right.scrollTop);
      }
    });

    document.addEventListener('mouseup', function() {
      isDragging = false;
    });


}
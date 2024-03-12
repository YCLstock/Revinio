function noteBox() {
    var note_box = document.getElementById("note_box");
    if (window.getComputedStyle(note_box).getPropertyValue("display") == "none") {
      note_box.style.display = "flex"; // 显示大Div
    } else {
      note_box.style.display = "none"; // 隐藏大Div
    }
  }
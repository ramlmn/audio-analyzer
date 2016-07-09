
  var audio;
  //could initialise with Jquery
   audioAnalyzer("#audio1", {
    count: 100,
    spacing: 2,
    color: ['#FF2F2F', '#FFEB3B'],
    callback: callback
  });

  function callback(analyzer) {
    console.log(analyzer);
    var sourceInput = document.querySelector("#sourceControl"),
      visualInput = document.querySelector("#visualControl"),
      colorInput = document.querySelector("#colorControl");

    sourceInput.addEventListener('change', function() {
      analyzer.audio.pause();
      analyzer.audio.src = this[this.selectedIndex].value;
      analyzer.audio.addEventListener("loadedmetadata", function() {
        analyzer.audio.play();
      }, false);
    });

    visualInput.addEventListener('change', function() {
      analyzer.visual(this[this.selectedIndex].value);
    });

    colorInput.addEventListener('change', function() {
      if (this[this.selectedIndex].value == 'color') {
        analyzer.color('#00adef');
      } else {
        analyzer.color(['#FF2F2F', '#FFEB3B']);
      }
    });
  }

# Audio Analyzer

A simple library which uses the browsers native HTML5 Web Audio API to create
visual effects.

## Usage

Markup:

``` html
<div class="audio__container">
  <audio src="source.ogg" id="myAudio" ></audio>
</div>
<script src="audioAnalyzer.js"></script>
```

JavaScript:

``` js
audioAnalyzer(selector, options)
```

A selector can be a string(id or class) or an audio node.

## Options

``` js
audioAnalyzer("#myAudio", {

  count: 100,
  // Number of bars to be shown in the canvas

  spacing: 2,
  // Spacing between individual bars

  targetEl: el,
  // A target html element to append the canvas
  // If not specified, canvas is appended as sibling to audio element

  color: '#00adef',
  // Color of bars or wave, can also be an array of colors

  visual: 'frequencybars',
  // Bars('frequencybars') or waves('sinewave')

  callback: function(analyzer) {
    console.log(analyzer);
  }
  // The callback function is called after the analyzer is initialized
  // Returns an object with methods that work on the analyzer
  // More on return object below

});
```

Return object:

> If a CSS class selector is passed as an argument, then an array of
> audioAnalyzer objects is returned

``` js
callback: function(analyzer) {

  analyzer.audio;
  // The audio DOM element

  analyzer.color(val);
  // Setter and getter for color, can also be an array of colors

  analyzer.visual(val);
  // Setter and getter for visual type

}
```

> <b>Note:</b> All the music files are used for demonstration purpose only, not
> with any other intention!

### License

Released under [GNU GPL v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)

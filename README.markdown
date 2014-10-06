<h1>Swipenav</h1>
<p>With this plugin you can add swipe action to a layer, and render actions for the left and right swipe move gesture. Works with mouse and touchscreen uniformly. You can also set it up to snap to grid, e.g. window width or a fraction of the width.</p>
<h2>Syntax</h2>
<pre><code>$(layer).addSwipe( leftFn, rightFn, { options } );</code></pre>
<ul>
	<li><code>leftFn</code> the function to be called on left swipe event</li>
	<li><code>rightFn</code> the function to be called on right swipe event</li>
</ul>
<h5>options</h5>
<ul>
	<li><code>minDist</code> minimum distance in pixels that is to be treated as swipe (default = 80)</li> 
	<li><code>snapGrid</code> the grid to snap, 1 means snap to whole width, 2: half width (default = 0, no snap)</li> 
	<li><code>keepWithin</code> the content is not allowed go off the window (default = true)</li>
	<li><code>enableSwipe</code> determines whether swipe is enabled or not, plugin can still be used for positioning and animating  (default = true)</li>
	<li><code>maxLeft</code> the maxiumum pixels an item can be swiped left beyond its size to reveal what is below  (default = false)</li>
	<li><code>maxRight</code> the maxiumum pixels an item can be swiped right beyond its size to reveal what is below  (default = false)</li>
</ul>
<h5>methods</h5>
<ul>
	<li><code>swipeto</code> allows an item to be animated to a location using a button or event other than swiping</li> 
	<li><code>unswipe</code> detach the swipe functionality from the element</li> 
	<li><code>resetswipe</code> moves the layer to the starting position</li> 
</ul>
<h2>Example</h2>
<pre><code>

	//this would be an expected setup to reveal nav under a page. The body would be set to be swipable and would allow 250px to be revealed  under the body for navigation.

	$(document).ready(function() {
		$('.body').addSwipe(function() {}, function() {}, {
			snapGrid: 1,
			keepWithin: false,
			maxLeft: 250,
			maxRight: 0
		});
		
		// Triggering the 'swipeto' method
		$('button').on('click', function() {
			$('.body').trigger('swipeto', [left, 250]);
		});
		
		// Triggering the 'resetswipe' method
		$('button_1').on('click', function() {
			$('.body').trigger('resetswipe');
		});
	});

</code></pre>
<h2>Requirements</h2>
<p><a href="http://docs.jquery.com/Downloading_jQuery">jQuery 1.7 or higher</a></p>
<h2>License</h2>
<p>Available for use in all personal or commercial projects under both <a href="MIT-LICENSE.txt">MIT</a> and <a href="GPL-LICENSE.txt">GPL licenses</a>.</p>


<h2>Based On</h2>

<a href="https://github.com/Laza/addswipe-plugin">AddSwipe Plugin</a> by <a href="http://lazaworx.com">Molnar Laszlo</a>

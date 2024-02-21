# Toggle classes on window.scrollY for Webflow

## 1 Add script

Paste the following script in the in the before `</body>` block in your Webflow page settings
`<script src='https://cdn.jsdelivr.net/gh/porfur/webflowScripts@main/toggleClassesOnWindowScrollY/index.min.js'></script>`

## 2 Select desired targets

Decide on the **target** element(s) you want to toggle when scrolling on the Y axis.
Let's say one or more divs with the class `.nav-bar`.
`<div class='nav-bar'>`

### Note

This can be any css selector like an id `#my-id`,tag `div` or attribute `[my-attribute]`

Selectors require the CSS selector of the element you want. So `.`in front of a className, `#` for an id, `[]` around attribute names, and nothing for tags.

## 3 Locate target(s)

Locate the elements you want to toggle on scroll
In out case the div with the class `.nav-bar`.

    <div class='nav-bar'>
    	<button class='my-btn'></button>
    	<button class='my-btn'></button>
    	<button class='my-btn'></button>
    </div>

## 4 Add primary attribute

There is one attribute required for this toggle to work

`op-y-scroll__class` The value of this attribute should be set to the class name you want to add when the scroll event is triggered.
For example `white`

### The result should look like this

    <div class='nav-bar', op-y-scroll__class='white'>
    	<button class='my-btn'></button>
    	<button class='my-btn'></button>
    	<button class='my-btn'></button>
    </div>

At this point if you publish the project and scroll down the class `white` will be added to the nav bar.
Some extra options are available below.

## 5 scroll offset

Add a second attribute `op-y-scroll__offset` and set it to the nr of pixels you want to scroll before the event is triggered

### The result should look like this

    <div class='nav-bar', op-y-scroll__class='white',op-scroll__offset='400'>
    	<button class='my-btn'></button>
    	<button class='my-btn'></button>
    	<button class='my-btn'></button>
    </div>

At this point if you publish the project and scroll down the class `white` will be added to the nav bar only after scrolling down more that 40px

## 6 Target children

There may be cases where you would like to toggle a **target** and the classes of it's children as-well.

For this there is the `op-y-scroll__child` attribute.
To use this attribute give it a value with the following format `childSelector : childToggleClass`.

You can also add multiple children by adding multiple `op-toggle__child` attributes and appending any sort of unique identifier to the attribute name.

Like so `op-toggle__child1`,`op-toggle__child2`,`op-toggle__child-asdf`.
Just make sure you don't have two of the same.

### Note Again

Selectors require the CSS selector of the element you want. So `.`in front of a className, `#` for an id, `[]` around attribute names, and nothing for tags.

### The result should look like this

    <div class='nav-bar'
    	op-y-scroll__class='white'
    	op-y-scroll__offset='400'
    	op-toggle__child1=".my-btn:red"
    	op-toggle__child2=".my-btn2:blue"
    	op-toggle__child3=".my-btn3:green" >
    	 	<button class='my-btn'></button>
    		<button class='my-btn2'></button>
    		<button class='my-btn3'></button>
    </div>

## 7 Conditional toggle

There may be cases where you would like to toggle a **target** only if another element has a specific class.
For example: Toggle the color of a nav bar only if the body has a specific class applied.
This way you could have the nav bar change color on scroll only on the pages where the body has a specific class

For this there is the `op-y-scroll__trigger-condition` attribute.
To use this attribute give it a value with the following format `selector : className`.
The effect will trigger only if the element specified as the `selector` has the class `className`

You can also add multiple conditions by adding multiple `op-toggle__trigger-condition` attributes and appending any sort of unique identifier to the attribute name.

Like so `op-toggle__trigger-condition1`,`op-toggle__trigger-condition2`,`op-toggle__trigger-condition3`.
Just make sure you don't have two of the same.

By default if more than one condition is added then all the conditions have to be true to apply the effect.
Optionally you can add the attribute `op-y-scroll__trigger-condition-type` with the value `some` to have the effect trigger if at least one of those conditions is true

### Note Again

Selectors require the CSS selector of the element you want. So `.`in front of a className, `#` for an id, `[]` around attribute names, and nothing for tags.

### The result should look like this

    <div class='nav-bar'
    	op-y-scroll__class='white'
    	op-y-scroll__offset='400'
    	op-toggle__child1=".my-btn:red"
    	op-toggle__child2=".my-btn2:blue"
    	op-toggle__child3=".my-btn3:green"
    	op-toggle__trigger-condition1="body:dark"
    	op-toggle__trigger-condition2="#footer:blue"
	op-y-scroll__trigger-condition-type="some" >
    	 	<button class='my-btn'></button>
    		<button class='my-btn2'></button>
    		<button class='my-btn3'></button>
    </div>

### Testing

After publishing check the html on the live page with the dev tools.
The script uses custom attributes to store the values it should use, so you can change them in real time for testing.
Try changing the scroll offset and see how it works.

## If there are any bugs let me know

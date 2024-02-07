# Toggle classes on window.scrollY for Webflow

## 1 Add script

Paste the following script in the in the before `</body>` block in your webflow page settings
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
    	<button class='my-btn'></button>ac
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
Some extra options are available.

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
		op-toggle__child1=".my-btn:red">
		op-toggle__child2=".my-btn:blue">
		op-toggle__child3=".my-btn:green">
		 	<button class='my-btn'></button>
			<button class='my-btn2'></button>
			<button class='my-btn'></button>
    </div>

### Testing

After publishing check the html on the live page with the dev tools.
The script uses custom attributes to store the values it should use, so you can change them in real time for testing.
Try changing the scroll offset and see how it works.

## If there are bugs let me know

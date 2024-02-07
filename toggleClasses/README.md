# Toggle classes on events for Webflow

## 1 Add script
Paste the following script in the in the before ```</body>``` block in your webflow page settings
				
	<script src='https://cdn.jsdelivr.net/gh/porfur/webflowScripts@main/toggleClasses/index.min.js'></script>
				
## 2 Select desired targets
Decide on the **target** element(s) you want to toggle when an event is triggered.
Let's say multiple divs with the class ```.spine```.
```<div class='spine'>```

### Note
This can be any css selector like an id ```#my-id```,tag ```div``` or attribute ```[my-attribute]```

Selectors require the CSS selector of the element you want. So ```.```in front of a className, ```#``` for an id, ```[]``` around attribute names, and nothing for tags.

## 3 Locate target(s) parent
Locate the parent element of those divs.
In out case the body.

	<body>
		<div class='spine'></div>	
		<div class='spine'></div>
		<div class='spine'></div>ac
	</body>
	
## 4 Add primary attributes
There are three attributes to add to the parent element.

1. ```op-toggle__target-selector``` The value of this attribute should be set to the CSS selector of the **target** elements. In our case the class ```.spine```


2. ```op-toggle__class``` The name of the class you want to add to the **targets** when their event *(ex: 'click')* is triggered.


3. ```op-toggle__events``` The event(s) you want to trigger the addition of the class. *You can also add multiple events separated by commas* ```,```.


### The result should look like this
	
	<body
		op-toggle__target-selector=".spine"
		op-toggle__class="open-spine"
		op-toggle__events="click,contextmenu"
	>
		<div class='spine'></div>	
		<div class='spine'></div>
		<div class='spine'></div>
	</body>
	
At this point if you publish the project and click on a **target** the class will be added to it and that's it.
Some extra options are required for having it toggle.

## 5 Behavior options
There are 2 behavior options you can add as attributes.
These should be added without any values

1.```op-toggle__opt--close-others``` This enables the option to "close" *(remove the class you set on ```op-toggle__class```)* from the **target(s)** that didn't trigger the event *(ex: click)*.

2.```op-toggle__opt--close-on-second-event``` This enables the option to "close" *(remove the class you set on ```op-toggle__class```)* from the **target** if you trigger the event *(ex: click)* a second time.

### Note
You can use one or both of them at the same time.

### The result should look like this
	
	<body
		op-toggle__target-selector=".spine"
		op-	toggle__class="open-spine"
		op-toggle__events="click,contextmenu"
		op-toggle__child=""
		op-toggle__opt--close-others=""
	>
		<div class='spine'></div>	
		<div class='spine'></div>
		<div class='spine'></div>
	</body>


## 6 Target children
There may be cases where you would like to click on a **target** and toggle the classes of it's children as-well. 

For this there is the ```op-toggle__child``` attribute.
To use this attribute give it a value with the following format ```childSelector : childToggleClass```.

You can also add multiple children by adding multiple ```op-toggle__child``` attributes and appending any sort of unique identifier to the attribute name. 

Like so ```op-toggle__child1```,```op-toggle__child2```,```op-toggle__child-asdf```.
Just make sure you don't have two of the same.

### Note Again
Selectors require the CSS selector of the element you want. So ```.```in front of a className, ```#``` for an id, ```[]``` around attribute names, and nothing for tags.

### The result should look like this
	
	<body
		op-toggle__target-selector=".spine"
		op-	toggle__class="open-spine"
		op-toggle__events="click,contextmenu"
		op-toggle__child-1="child:open-child"
		op-toggle__child-2="nested-child:open-nested-child"
		op-toggle__opt--close-others=""
	>
		<div class='spine'>
			<div class='child'>
				<div class='nested-child'></div>
			</div>
		</div>	
		<div class='spine'>
			<div class='child'>
				<div class='nested-child'></div>
			</div>
		</div>	
		<div class='spine'>
			<div class='child'>
				<div class='nested-child'></div>
			</div>
		</div>	

	</body>


##If there are bugs let me know

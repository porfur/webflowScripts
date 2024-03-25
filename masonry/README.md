# Collection List Masonry

## 1 Add script

Paste the following script in the in the before ```</body>``` block in your Webflow page settings
```<script src='https://cdn.jsdelivr.net/gh/porfur/webflowScripts@main/masonry/index.min.js'></script>```

## 2 Select the desired collection list

Add custom css in an embed on a page, or in the head of the page or the entire project.
In that custom css set a css variable equal to the nr of columns you want the masonry layout to have.
Then you can add as many breakpoints as you want and change the value of the variable at each one.

### Note

A css variable is declared with a double dash ```--```, and the value should be a whole nr.

    <style>
    :root{
        --columns:3
    }

    @media screen and (min-width:1280px) {
        :root{
            --columns:5
        }
    </style>

## 3 Add attributes to collection list

Add the attribute ```op-masonry__root``` to the collection list (no value required)

Add the attribute ```op-masonry__col-css-var``` and set it's value to the name of the css variable (including the dashes ```--```, like so ```--columns```).

Add the attribute ```op-masonry__child-selector``` and set it's value to the css selector of the collection item.

### The result should look like this

    <div class='collection-list'
        op-masonry__root
        op-masonry__col-css-var="--column"
        op-masonry__child-selector="collection-item"
        >
    	<div class='collection-item'></div>
    	<div class='collection-item'></div>
    	<div class='collection-item'></div>
    </div>

At this point if you publish the project masonry will be applied and it will re-arrange based on the css breakpoints.

Some extra options are available below.

## 4 Delay

By default there is a 100ms timeout set when resizing the browser.
You can modify the timeout by adding the attribute ```op-masonry__delay``` to the collection-list and setting it's value to another nr of milliseconds

## 5 Style the columns

The columns are added as ```<div>``` children of the collection list with each containing the correct collection item.

    <div class='collection-list'
        op-masonry__root
        op-masonry__col-css-var="--column"
        op-masonry__child-selector="collection-item"
        >
        <div>
            <div class='collection-item'> 1 </div>
            <div class='collection-item'> 4 </div>
            <div class='collection-item'> 7 </div>
        </div>
        <div>
            <div class='collection-item'> 2 </div>
            <div class='collection-item'> 5 </div>
            <div class='collection-item'> 8 </div>
        </div>
        <div>
            <div class='collection-item'> 3 </div>
            <div class='collection-item'> 6 </div>
            <div class='collection-item'> 9 </div>
        </div>
    </div>

There may be cases where you would want to style those column ```divs```.
Instead of embeding custom css on the page there is the option of styling a template div directly in webflow.

Follow these steps to use the column template option

### 1 Add an id to the collection

Add a unique id to the ```op-masonry__root``` attribute of your target collection.

    <div class='collection-list'
        op-masonry__root="id-for-my-collection"
        op-masonry__col-css-var="--column"
        op-masonry__child-selector="collection-item"
    > ...
    <div/>

### 2 Create a template and link it to the collection using the id

Anywhere on the page create a ```<div>``` and set the following custom attribute ```op-masonry__col-template-for```.
Set it's value to the value of the target collection's ```op-masonry__root```.

    <div
        class="collection-column"
        op-masonry__col-template-for="id-for-my-collection"
        >
    <div/>


### 3 Style the column using webflow.

You might find that you need to mock up a temporary container and multiple columns to get an idea of how it will look.
Once you are ok with the styling delete the mockup any duplicates and keep just one instance of the template

### 4 Publish

When the code runs it deletes that instance of the template and applies it's css to each masonry column.

### Note

If the template is bothering you while working in the Webflow designer it might be tempting to set it to ```display:none```
That would also set the masonry columns to ```display:none```
Instead wrap it in a div and hide that one.
    
    <div class="hidden-templates">
        <div
            class="collection-column"
            op-masonry__col-template-for="id-for-my-collection"
        >
        <div/>
    </div>


## 6 Rows (optional)

There may be cases where you want a certain nr of rows (items per column) but you have no idea how many columns that is.
In those cases add the attribute ```op-masonry__row-css-var``` to the ```collection-list``` and set it to the desired nr of rows.
If the rows are set with a value greater than 0 the column nr from ```op-masonry__col-css-var``` is ignored.
The nr of columns is calculated as ```nr of rows / nr of items```

### Note
This is usually used to have lots of columns that scroll horizontally.
It should be used in combination with ```op-masonry__col-template-for``` in order to style the column width.


## 7 Smart stack

By default the items are stacked in order from left to right regardless of their height.
In extreme cases this may lead to the bottom of the stack being really uneven.
If the precise order of the items is not important to you can add the attribute ```op-masonry__smart-stack```
This always places the next item in the shortest column possible.
The sorting order is still maintained but it's not as precise.


## 7 Lazy

If the collection-items contain lazy loading images that influence it's height
you can add the attribute ```op-masonry__lazy```.
This automatically behaves like the ```op-masonry__smart-stack```
but places each item only after the previous one has been loaded

## If there are any bugs let me know

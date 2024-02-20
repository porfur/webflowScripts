# Collection List Masonry

## 1 Add script

Paste the following script in the in the before `</body>` block in your Webflow page settings
`<script src='https://cdn.jsdelivr.net/gh/porfur/webflowScripts@main/masonry/index.min.js'></script>`

## 2 Select the desired collection list

Add custom css in an embed on a page, or in the head of the page or the entire project.
In that custom css set a css variable equal to the nr of columns you want the masonry layout to have. 
Then you can add as many breakpoints as you want and change the value of the variable at each one.

### Note

A css variable is declared with a double dash `--`, and the value should be a whole nr.

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

Add the attribute `op-masonry__root` to the collection list (no value required)

Add the attribute `op-masonry__col-css-var` and set it's value to the name of the css variable (including the dashes `--`, like so `--columns`).

Add the attribute `op-masonry__child-selector` and set it's value to the css selector of the collection item. 

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
You can modify the timeout by adding the attribute `op-masonry__delay` to the collection-list and setting it's value to another nr of milliseconds

## If there are any bugs let me know

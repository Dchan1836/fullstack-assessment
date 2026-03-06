## Bugs and Fixes

| Bug name | Bug description | Fix | Why |
|---|---|---|---|
| Filter not clearing | After a filter is set and the user clicks clear filter the text does not change back to "All Categories" | To fix this I added a nullish operator to the value property on the select to set it to an empty string so the placeholder text gets used instead when the selectedCategory is cleared. | It is a simple inline way to display the default if there is no value. |
| Listed products | When no filter is selected the page only displays 20 products. | I added pagination | pagination is a more user friendly way to display all the products. It also exchanges having one big slow api call to get everything with smaller calls to just get a pages worth of content at a time.  | 
| Search term runtime error | When entering in certain characters particularly numbers and symbols other than 4 and 9 create a error stating "Invalid src prop (https://images-na.ssl-images-amazon.com/images/I/81ZSuzkKKHL._AC_SL1500_.jpg) on `next/image`, hostname "images-na.ssl-images-amazon.com" is not configured under images in your `next.config.js`" See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host" | Added another remote pattern to next.config so that product imageUrls from anouther remote source are handled | A minimally invasive way to allow more remote sources setting a pattern to quickly add more remote sources as needed. |
| Search term runtime type error | When entering a 9 into the search box it creates an error stating "Cannot read properties of undefined (reading '0')" in the page.tsx file. | Added defensive code to the page.tsx file | Not all product data has every property like imageUrl i decided to change the page.tsx to be more defensive because you cant guarantee the data it will recieve will be perfect.  |

## Possible Improvements

- Adding libraries like Tanstack Query to manage state across refreshes or page changes, handle pagination, and system errors. 
- Integrating a database and using that to operate and filter the data for faster queries and to protect data. A SQL database would be a better option over a noSQL database because th eproduct data is structured. 
- Adding in a AI agent chat bot to help the user find what they are looking for since some users don't always know what they are looking for it would be easier for them to describe the requirements and have the agent go find it. 
- Adding similarity search to the search feature to show more similar products to the user.
- Adding in a section in product details that displays similar products. I could use a similarity search algorithm to get this. 
- Keep track of products the user has looked at in the last day, week or month and display it in a tab or viewing carousel at the bottom.
- Group the search categories based on similar stuff like batteries, gaming equipment, fitness, etc. so that it is easier for the user to select categories quicker. 
- Localization to change the language and general trend preferences based on the region of the user.
- Adding technoloogies like Tailwind or styled components for more efficient styling.
- Adding in the ability for the user to favorite items which tells the site that they really like or are activily looking for this type of product so the site can serve them more of the same type of product. 
- Adding in the ability for the user to create shopping lists for different uses or occations. the name of the list and the products in the list can provide information to the site to serve similar products to the user. 
- Prompt the user if they are ok with cross site tracking and if the user allows it gather more relevant data on them. 
- Implementing more reusable components.
- Using higher order components to pull out common functionality that can be applied to multiple components.
- Put product images in a carousel for more screen space efficiency. 
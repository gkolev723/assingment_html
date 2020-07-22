//Set to true in order to 'spy' the iterations of the algorithm
const debug = false;

//---------------------------------------Input data that can be modified by the user --------------------------------

//Target coordinates (x1,y1)
//Please have in mind that coordinates (x1,y1) need to be reversed in order to calculate correctly.
//So for example x1 = 0, y1 = 1 represent the coordinates (1,0)
const x1 = 0, y1 = 1;

//Iterations count
const n = 10;

//Two dimentional array (array of arrays) representing the current generation of the grid
const currentGenerationGrid = [
    [0,0,0],
    [1,1,1],
    [0,0,0]
];

//-------------------------------------------------------------------------------------------------------------------


//Two dimentional array that will hold the changes of the current generation of the grid 
//while applying the rules and there for will be used in order to copy its elements to the array above
//before proceeding to the next generation rule appliement.
const previousGenerationGrid = [];


/**
 * The first function that gets triggered upon website load.
 * @returns {undefined}
 */
const init = () => {
    if(n > 0 && x1 >=0 && x1 < currentGenerationGrid.length && y1 >= 0 && y1 < currentGenerationGrid[x1].length && isGridOk()) {
        //Before we start the algorithm we need to initalize the seconds array with the exact same
        //elements as the first array because it will be used in order to keep the changes based on the rules we apply.
        copyArrays(previousGenerationGrid, currentGenerationGrid);

        //The result of the algorithm.
        const result = getResult();

        //Printing to console.
        console.log("Result: " + result);
    } else {
        console.log("Invalid input data!");
    }
};


/**
 * The main function used to calculate the result.
 * @returns {Number} - the result of the applied rules.
 */
const getResult = () => {
    //This is the counter that will be increased during each iteration 
    //if the cell value of (x1,y1) == 1 after the applied rules.
    let greenCounter = 0;
    
    //Iterating N times to apply the rules.
    for(let i=0; i<n; i++) {
        applyRules();
        if(debug) {
            console.log("------------------------------------ " + (i+1));
        }
        
        //After the rules are applied we check if the targeted cell (x1,y1) is green.
        //and in case the condition is true we increment the counter.
        if(previousGenerationGrid[x1][y1] === 1) {
            greenCounter++;
        }
        
        //After the applied rules before we start the next iteration
        //we need to apply the changes of the current iteration to the grid.
        copyArrays(currentGenerationGrid, previousGenerationGrid);
    }
    
    return greenCounter;
};

/**
 * Void function that acts as a container to the functions which
 * apply the rules based on the condition of the current grid cell.
 * 
 * @returns {undefined}
 */
const applyRules = () => {
    //For each grid cell we need to check which rule we need to apply.
    for(let i=0; i< currentGenerationGrid.length; i++) {
        for(let j=0; j<currentGenerationGrid[i].length; j++) { 
            //If the current cell is red we apply the rule for that.
            if(currentGenerationGrid[i][j] === 0) applyRedCellRule(i,j);
            else applyGreenCellRule(i,j);
            
            if(debug) {
                printGrid(currentGenerationGrid);
            }
        }
    }
};

/**
 * This function checks if the cell value is red and applies the rule
 * after additional checking.
 * 
 * @param {type} x - coordinate
 * @param {type} y - coordinate
 * @returns {undefined}
 */
const applyRedCellRule = (x, y) => {
    //A bit of defensive programming here just in case the caller function
    //didnt check for this condition.
    if(currentGenerationGrid[x][y] === 0) {
        
        //For the current cell coordinates we want to get an array of all the neighbour cells
        const neighbours = getNeighbours(x, y);
        
        //Then we calculate how much of these cell values are equal to 1. 
        const count = getCount(neighbours, 1);
        
        //In case the count is based on the requirmenets we modify the grid cell.
        if(count === 3 || count === 6) {
            previousGenerationGrid[x][y] = 1;
        }
    }
};

/**
 * This function checks if the cell value is green and applies the rule
 * after additional checking.
 * 
 * @param {type} x - coordinate
 * @param {type} y - coordinate
 * @returns {undefined}
 */
const applyGreenCellRule = (x, y) => {
    //A bit of defensive programming here just in case the caller function
    //didnt check for this condition.
    if(currentGenerationGrid[x][y] === 1) {
        
        //For the current cell coordinates we want to get an array of all the neighbour cells
        const neighbours = getNeighbours(x, y);
        
        //Then we calculate how much of these cell values are equal to 1. 
        const count = getCount(neighbours, 1);
        
        //In case the count is based on the requirmenets we modify the grid cell.
        if(count === 0 || count === 1 || count === 4 || count === 5 || count === 7 || count === 8) {
            previousGenerationGrid[x][y] = 0;
        }
    }
};

/**
 * Gets the values of the surrounding cells of the one which coordinates are passed to the function.
 * 
 * @param {type} x - координата
 * @param {type} y - координата
 * @returns {Array|getNeighbours.list}
 */
const getNeighbours = (x, y) => {
    //The array which will hold the values of the neighbour cells of the cell with coordinates (x,y)
    const list = [];
    
    //All the possible coordinates of the neighbour cells of the cell with coordinates (x,y)
    const coordinates = [[x-1, y-1], [x-1, y], [x-1, y+1], [x, y-1], [x, y+1], [x+1, y-1], [x+1, y], [x+1, y+1]];
    
    //We need to iterate throght the coordinates and get the values of the cells.
    //However depending of wherethe (x,y) cell is the number of the neigbour cells is not constant so
    //we need to apply some checking in order to make sure we are not exceeding the array borders and
    //getting out of bounds exception in form of undefined value.
    for(let i=0; i<coordinates.length; i++) {
        if(coordinates[i][0] in currentGenerationGrid && coordinates[i][1] in currentGenerationGrid[coordinates[i][0]]) {
            const gridCellValue = currentGenerationGrid[coordinates[i][0]][coordinates[i][1]];
            list.push(gridCellValue); 
        }
        
//        try 
//        {
//            const gridCellValue = currentGenerationGrid[coordinates[i][0]][coordinates[i][1]];
//            if(typeof gridCellValue !== 'undefined') {
//                list.push(gridCellValue);
//            }            
//        } 
//        catch(err) { }
    }
    return list;
};

/**
 * Function that accepts an array and value and checks how many times the value is in the array values.
 * (The approach we use here is based on imperative programing style without using an functional approach like
 * 'reduce' method).
 * 
 * @param {type} arr - The array we need to iterate.
 * @param {type} val - The value we are looking for in the array.
 * @returns {Number} - The amount of times the @val is met in the @arr.
 */
const getCount = (arr, val) => {
    let count = 0;
    for(let i=0; i<arr.length; i++) {
        if(arr[i] === val) {
            count++;
        }
    }

    return count;
};

/**
 * Copping elements from one two dimentinal array into another two dimentional array.
 * @param {type} to - The destination array
 * @param {type} from - The source array.
 * @returns {undefined}
 */
const copyArrays = (to, from) => {
    for (let i = 0; i < from.length; i++)
        to[i] = from[i].slice();
    
//    for(let i=0; i<from.length; i++) {
//        for(let j=0; j<from[i].length; j++) {
//            to[i][j] = from[i][j];
//        }
//    }
};

/**
 * Prints a two dimentional array for debugging purposes.
 * 
 * @param {type} arr
 * @returns {undefined}
 */
const printGrid = (arr) => {
    for(let i=0; i< arr.length; i++) {
        console.log(arr[i]);
    }
};

const isGridOk = () => {
    let flag = true;
    if(currentGenerationGrid.length === 0) flag = false;
    else {
        const firstArrLength = currentGenerationGrid[0].length;
        for(let i=1; i<currentGenerationGrid.length; i++) {
            if(currentGenerationGrid[i].length !== firstArrLength) {
                flag = false;
                break;
            }
        }
    }
    
    return flag;
};


window.onload = init;
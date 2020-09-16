// Module Patterns --> Returns an object with all the functions we want to be PUBLIC!

var id = 0;

var budgetController = (function(){

    var income = Number(0);
    var expense = Number(0);

//    
    return {
        // Basically when adding an item
        calcBudget: function(value, sign){
            if(sign === 'inc'){
                income += Number(value);
            }
            else{
                expense += Number(value);
            }
            return {
              income : income,
              expense : expense
            };
        },

        // when deleting an item
        deleteItem: function(value, sign){
            // Some Code
            if(sign === 'inc'){
                income -= Number(value);
            }
            else{
                expense -= Number(value);
            }
            return {
              income : income,
              expense : expense
            };   
        }
    };
})();


var UIController = (function(){
    
    //DRY
    return {
        getInput : function(){
            // getting values of description and cost.
            return {
            oprn : document.querySelector('.add__type').value, //gives inc/exp depending 
            desc : document.querySelector('.add__description').value,
            value : document.querySelector('.add__value').value,
            id : id
        };
        },
        
        updateIncExp : function(obj, type, income){
            var html;
            
            if(type === 'inc'){
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                html = html.replace('%description%', obj.desc);
                html = html.replace('%value%', obj.value);
                html = html.replace('%id%', id);
                document.querySelector('.income__list').insertAdjacentHTML('beforeEnd', html);   
            }
            else{
                percentage = Math.floor((obj.value * 100) / income);
                if (percentage === Infinity)
                    percentage = 0;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">%precentage% %</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                html = html.replace('%description%', obj.desc);
                html = html.replace('%value%', obj.value);
                html = html.replace('%id%', id);
                html = html.replace('%precentage%', percentage);
                document.querySelector('.expenses__list').insertAdjacentHTML('beforeEnd', html);
            }
            
        },
        
        deleteElement : function(itemID){
            var el;
            el = document.getElementById(itemID);
            el.parentNode.removeChild(el);       // to delete a component, we have to first jump to its parent and then delete child node!
            
        },
        
        updateSum : function(sum){
            sum >= 0 ? document.querySelector('.budget__value').textContent = '+ ' + sum : document.querySelector('.budget__value').textContent = sum;
            
        },
        
        updateIncomeExpense: function(cur_income, cur_expense){

            document.querySelector('.budget__income--value').textContent = '+ ' + cur_income;
            document.querySelector('.budget__expenses--value').textContent = '- ' + cur_expense;
            percent = Math.floor((Number(cur_expense) * 100) / Number(cur_income));
            if (percent && percent!== Infinity)
                document.querySelector('.budget__expenses--percentage').textContent = percent + ' %';
            else
                document.querySelector('.budget__expenses--percentage').textContent = 0 + ' %'

        },
        
        getCurMonth : function(){
            var d = new Date();
            var month = new Array();
            month[0] = "January";
            month[1] = "February";
            month[2] = "March";
            month[3] = "April";
            month[4] = "May";
            month[5] = "June";
            month[6] = "July";
            month[7] = "August";
            month[8] = "September";
            month[9] = "October";
            month[10] = "November";
            month[11] = "December";
            
            return month[d.getMonth()] + ' ' + d.getFullYear();
        }
        
      };
    
})();


var Controller = (function(bCont, uCont){
    
    // Setting Event Listeners for structuring
    var invokeEvents = function(){
        document.querySelector('.budget__title--month').textContent = uCont.getCurMonth();
        
        document.querySelector('.budget__value').textContent = '+ ' + 0;
        document.querySelector('.budget__income--value').textContent = '+ ' + 0;
        document.querySelector('.budget__expenses--value').textContent = '- ' + 0;
        document.querySelector('.budget__expenses--percentage').textContent = 0 + ' %';
        
        document.querySelector('.add__btn').addEventListener('click', press);
        
        // event is by default 
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13){
                press();
            }
        });
        
        document.querySelector('.container').addEventListener('click', deleteItem);

    }
    
    // Basically for Budget Control after addition and deletion of an ITEM.
    var update = function(value, type, calc){
        var cur_sum;
        
        if (calc === 'bud')
            cur_sum = bCont.calcBudget(value, type);
        else
            cur_sum =  bCont.deleteItem(value , type);
        
        var sum = cur_sum.income - cur_sum.expense;
        uCont.updateSum(sum);
        uCont.updateIncomeExpense(cur_sum.income, cur_sum.expense);
        
        return cur_sum;

    }
    
    var press = function(){
        
        var input = uCont.getInput(); //remember to *****CALL***** the function in cases it is not passed as an argument!
        if(input.desc !== '' && input.value !== '' && Number(input.value) !== Number(0)){
            
            cur_sum = update(input.value, input.oprn, 'bud');
            uCont.updateIncExp(input, input.oprn, cur_sum.income);
            id += 1;
            
        }
        
        //clearing fields!
        document.querySelector('.add__description').value = "";
        document.querySelector('.add__value').value = "";
    }
    
    var deleteItem = function(event){
        
        // When we click the button, we want to remove the whole div  with id inc-id or exp-id.. not just the button
        var itemID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //VVIP to see where we are clicking. And for Event Delegation.
        var val = event.target.parentNode.parentNode.parentNode.querySelector('.item__value').textContent;
        val = val.split(' ');
        val = Number(val[1]);
        if(itemID){
            var splitID = itemID.split('-');
            var type = splitID[0];
//            console.log(ID, type); --> VVIP
            
            //Update the Budget
            update(val, type, 'del');            
      
            //Delete from UI
            uCont.deleteElement(itemID);
            
        }
    }
    
    return{
          init : function(){
              invokeEvents(); // invoking the Events.
          }
    };
 
    
})(budgetController, UIController);

Controller.init() // globally initializing

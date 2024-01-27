var deposit = prompt("შეიყვანეთ ანაბრის თანხა")

var percent = prompt("შეიყვანეთ საპროცენტო განაკვეთი")

percent = percent < 0 ? -percent: percent;
deposit = deposit < 0 ? -deposit: deposit;

var finalDeposit = parseInt(deposit)
var finalPercent = parseInt(percent)

var bonusMinimumAmount = 5000;
var bonusPercent = 5;

if(finalDeposit >= bonusMinimumAmount)
{
    finalAmount = finalDeposit + finalDeposit * (finalPercent + bonusPercent) / 100
}
else{
    finalAmount = finalDeposit + finalDeposit * finalPercent / 100
}

var bonus = finalPercent <= 2;
var bonusAmount = 505;

if(bonus){
    finalAmount += bonusAmount
}

alert("პროცენტის დარიცხვის შემდეგ ჩვენი თანხა იქნება: " + finalAmount)
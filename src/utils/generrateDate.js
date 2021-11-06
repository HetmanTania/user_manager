export default function(year, month, day ) {
    month = month + 1;
    if(day < 10) {
        day = "0" + day;
    }
    return `${year}-${month}-${day}`;
}
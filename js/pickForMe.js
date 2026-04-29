function getRandomActivity(activityArray) {
    // validasi
    if(!activityArray || activityArray.length === 0){
        return null;
    }
    var randomActivity = Math.floor(Math.random() * activityArray.length);
    
    return activityArray[randomActivity];
}
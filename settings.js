const settings = {
    SaveAllScreenshots: true,
    ScreenShotFoldernName: "allss",
    ApplicationName: "Citra Nightly 2104 | Pokémon Ultra Sun",
    GameName: "Pokémon Ultra Sun",
    port: 5000,

    //lower bound for pokemon hsv values
    LowerBound: [30, 150, 50], //(30, 150, 50)
    //upper bound for pokemon hsv values
    UpperBound: [50,255,255],  //(50, 255, 255)

    // all the times are in milliseconds

    FirstMoveTime: 1000,
    FirstKeyValue: "a",

    SecondMoveTime: 100,
    SecondKeyValue: "b",

    ThirdMoveTime: 1200,
    ThirdKeyValue: "a",

    FourthMoveTime: 1000,
    FourthKeyValue: "b",

    FifthMoveTime: 4850,
    FifthKeyValue: "up",

    SixthMoveTime: 3500,
    SixthKeyValue: "f6",

    MaximumWaitTimeforProcessingOfPhotoDetection: 3500,
};

module.exports = settings;
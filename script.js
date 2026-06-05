console.log("SCRIPT LOADED");


// --------------------
// Dynamic Background
// --------------------

function setBackgroundByTime() {

    const hour =
        new Date().getHours();

    let background;

    if (
        hour >= 5 &&
        hour < 10
    ) {

        background =
            "linear-gradient(135deg, #89CFF0, #FFD6A5)";
    }

    else if (
        hour >= 10 &&
        hour < 17
    ) {

        background =
            "linear-gradient(135deg, #87CEEB, #DFF6FF)";
    }

    else if (
        hour >= 17 &&
        hour < 19
    ) {

        background =
            "linear-gradient(135deg, #FF9A8B, #FDCB82)";
    }

    else {

        background =
            "linear-gradient(135deg, #0F172A, #1E293B)";
    }

    document.body.style.background =
        background;
}


// --------------------
// Elements
// --------------------


const weatherList =
    document.getElementById(
        "weather-alerts"
    );


// --------------------
// Current Weather
// --------------------

async function getCurrentWeather() {

    try {

        const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=35.44&longitude=139.64&current=temperature_2m,apparent_temperature,wind_speed_10m,weather_code"
        );

        const data =
            await response.json();

        console.log(
            "CURRENT WEATHER"
        );

        console.log(data);

        const temp =
            data.current.temperature_2m;

        const feelsLike =
            data.current.apparent_temperature;

        const windSpeed =
            data.current.wind_speed_10m;

        const code =
            data.current.weather_code;

        const weatherIcon =
            document.getElementById(
                "weather-icon"
            );

        const weatherTemp =
            document.getElementById(
                "weather-temp"
            );

        const weatherCondition =
            document.getElementById(
                "weather-condition"
            );

        const weatherFeels =
            document.getElementById(
                "weather-feels"
            );

        const weatherWind =
            document.getElementById(
                "weather-wind"
            );

        weatherTemp.textContent =
            `${temp}°C`;

        const weatherMap = {

            0: [
                "☀️",
                "Clear"
            ],

            1: [
                "🌤️",
                "Mostly Clear"
            ],

            2: [
                "⛅",
                "Partly Cloudy"
            ],

            3: [
                "☁️",
                "Cloudy"
            ],

            45: [
                "🌫️",
                "Fog"
            ],

            48: [
                "🌫️",
                "Fog"
            ],

            51: [
                "🌦️",
                "Light Drizzle"
            ],

            61: [
                "🌧️",
                "Rain"
            ],

            63: [
                "🌧️",
                "Rain"
            ],

            65: [
                "🌧️",
                "Heavy Rain"
            ],

            71: [
                "❄️",
                "Snow"
            ],

            80: [
                "🌦️",
                "Rain Showers"
            ],

            95: [
                "⛈️",
                "Thunderstorm"
            ]
        };

        const weather =
            weatherMap[code]
            || [
                "❔",
                "Unknown"
            ];

        weatherIcon.textContent =
            weather[0];

        weatherCondition.textContent =
            weather[1];

        if (
            weatherFeels
        ) {

            weatherFeels.textContent =
                `Feels Like ${feelsLike}°C`;
        }

        if (
            weatherWind
        ) {

            weatherWind.textContent =
                `Wind ${windSpeed} km/h`;
        }

    }

    catch(error) {

        console.error(
            "CURRENT WEATHER ERROR"
        );

        console.error(error);
    }
}


// --------------------
// Warning Data
// --------------------

async function getWarningData() {

    try {

        const response =
            await fetch(
                "https://www.data.jma.go.jp/multi/data/VPWS50/JPTF_en.json"
            );

        const data =
            await response.json();

        if (
            datetimeElement
        ) {

            datetimeElement.textContent =
                data.reportDateTime;
            
            const headerDatetime =
    document.getElementById(
        "header-datetime"
    );

if (headerDatetime) {

    headerDatetime.textContent =
        data.reportDateTime;

}
        }

        const eastArea =
            data.itemArea2.find(
                item =>
                    item.area.code ===
                    "140010"
            );

        if (
            !eastArea
        ) {

            weatherList.innerHTML =
                "<li>⚠️ East Area Not Found</li>";

            return;
        }

        const judgementIcon =
            document.getElementById(
                "judgement-icon"
            );

        const judgementStatus =
            document.getElementById(
                "judgement-status"
            );

        const judgementReason =
            document.getElementById(
                "judgement-reason"
            );

const alertSummary =
    document.getElementById(
        "alert-summary"
    );

    const alertBar =
    document.getElementById(
        "alert-level-bar"
    );

const alertIcons =
    document.getElementById(
        "alert-icons"
    );

weatherList.innerHTML =
    "";

alertIcons.innerHTML =
    "";

const displayedIcons =
    new Set();

        let judgementLevel =
            "green";

        let activeAlerts =
            [];

        if (
            !eastArea.kind ||
            eastArea.kind.length === 0
        ) {

            weatherList.innerHTML =
                "<li>🟢 No Active Alerts</li>";

            judgementIcon.textContent =
                "🟢";

            judgementStatus.textContent =
                "Normal Operation";

            judgementStatus.className =
                "status-text status-green";

            judgementReason.textContent =
                "No Active Alerts";
            
            alertSummary.textContent =
                 "🟢 No Active Alerts";
            alertSummary.style.color =
                "#30D158";
            
            alertBar.style.background =
            "#30D158";

            return;
        }

        eastArea.kind.forEach(
            kind => {

                const warningName =
                    kind.name;

                if (
                    warningName.includes(
                        "Warning"
                    )
                ) {

                    judgementLevel =
                        "red";
                }

                else if (
                    judgementLevel !==
                    "red"
                ) {

                    judgementLevel =
                        "yellow";
                }

                activeAlerts.push(
                    warningName
                );

const li =
    document.createElement(
        "li"
    );

let icon = "⚠️";

if (
    warningName.includes(
        "Wave"
    )
) {

    icon = "🌊";

}

else if (
    warningName.includes(
        "Landslide"
    )
) {

    icon = "⛰️";

}

else if (
    warningName.includes(
        "Wind"
    )
) {

    icon = "💨";

}

else if (
    warningName.includes(
        "Rain"
    )
) {

    icon = "🌧️";

}

else if (
    warningName.includes(
        "Thunder"
    )
) {

    icon = "⛈️";

}

else if (
    warningName.includes(
        "Snow"
    )
) {

    icon = "❄️";

}

li.textContent =

    `${icon} ${warningName}`;

weatherList.appendChild(

    li

);

if (

    !displayedIcons.has(icon)

) {

    displayedIcons.add(

        icon

    );

    const iconSpan =

        document.createElement(

            "span"

        );

    iconSpan.textContent =

        icon;

    alertIcons.appendChild(

        iconSpan

    );

}

if (
    !displayedIcons.has(icon)
) {

    displayedIcons.add(icon);

    const iconSpan =
        document.createElement(
            "span"
        );

    iconSpan.textContent =
        icon;

    alertIcons.appendChild(
        iconSpan
    );

}

            }
        );

        if (
            judgementLevel ===
            "red"
        ) {

            judgementIcon.textContent =
                "🔴";

            judgementStatus.textContent =
                "Review Conditions";

            judgementStatus.className =
                "status-text status-red";

            alertBar.style.background =
            "#FF453A";
        }

        else {

            judgementIcon.textContent =
                "🟡";

            judgementStatus.textContent =
                "Use Caution";

            judgementStatus.className =
                "status-text status-yellow";

            alertBar.style.background =
            "#FFD60A";
        }

const alertCount =
    activeAlerts.length;

if (
    judgementLevel === "red"
) {

    alertSummary.textContent =
        `🔴 ${alertCount} Active Alert${alertCount > 1 ? "s" : ""}`;

    alertSummary.style.color =
        "#FF453A";

}

else {

    alertSummary.textContent =
        `🟡 ${alertCount} Active Alert${alertCount > 1 ? "s" : ""}`;

    alertSummary.style.color =
        "#FFD60A";

}


        judgementReason.textContent =
            activeAlerts.join(
                ", "
            );

    }

    catch(error) {

        console.error(error);

        weatherList.innerHTML =
            "<li>❌ Warning Data Error</li>";
    }
}

// --------------------
// Hourly Forecast
// --------------------

async function getHourlyForecast() {

    try {

        const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=35.44&longitude=139.64&hourly=temperature_2m,weather_code,precipitation_probability,relative_humidity_2m&timezone=Asia%2FTokyo&forecast_days=2"
        );

        const data =
            await response.json();

        console.log("HOURLY DATA");
        console.log(data);

        const container =
            document.getElementById(
                "hourly-container"
            );

        const humidityContainer =
            document.getElementById(
                "humidity-container"
            );

        const tempLine =
            document.getElementById(
                "temp-line"
            );

        const tempFill =
            document.getElementById(
                "temp-fill"
            );

        const tempPoints =
            document.getElementById(
                "temp-points"
            );

        container.innerHTML = "";

        if (humidityContainer) {

            humidityContainer.innerHTML = "";

        }

        tempPoints.innerHTML = "";

        const currentHour =
            new Date().getHours();

        const startIndex =
            data.hourly.time.findIndex(
                time =>
                    time.includes(
                        `${String(currentHour).padStart(2, "0")}:00`
                    )
            );

        const temps = [];
        const points = [];

        for (
            let i = 0;
            i < 6;
            i++
        ) {

            const index =
                startIndex + i;

            const temp =
                data.hourly.temperature_2m[
                    index
                ];

            const code =
                data.hourly.weather_code[
                    index
                ];

            const rainChance =
                data.hourly
                    .precipitation_probability[
                        index
                    ];

            const humidity =
                data.hourly
                    .relative_humidity_2m[
                        index
                    ];

            temps.push(temp);

            let icon = "☀️";

            if (
                code >= 1 &&
                code <= 3
            ) icon = "⛅";

            else if (
                code >= 45
            ) icon = "🌫️";

            else if (
                code >= 51
            ) icon = "🌧️";

            else if (
                code >= 71
            ) icon = "❄️";

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "hour-item";

            item.innerHTML = `

                <div class="hour-time">
                    ${
                        i === 0
                        ? "Now"
                        : data.hourly.time[index]
                            .slice(11,16)
                    }
                </div>

                <div class="hour-icon">
                    ${icon}
                </div>

                <div class="hour-temp">
                    ${Math.round(temp)}°
                </div>

                <div class="hour-rain">
                    ${rainChance}%
                </div>

            `;

            container.appendChild(
                item
            );

            if (humidityContainer) {

                const humidityItem =
                    document.createElement(
                        "div"
                    );

                humidityItem.className =
                    "humidity-item";

                humidityItem.textContent =
                    `${humidity}%`;

                humidityContainer.appendChild(
                    humidityItem
                );

            }

        }

        const maxTemp =
            Math.max(...temps);

        const minTemp =
            Math.min(...temps);

        const midTemp =
            (
                maxTemp +
                minTemp
            ) / 2;

        document.getElementById(
            "temp-max"
        ).textContent =
            `${maxTemp}°`;

        document.getElementById(
            "temp-mid"
        ).textContent =
            `${midTemp.toFixed(1)}°`;

        document.getElementById(
            "temp-min"
        ).textContent =
            `${minTemp}°`;

        const chartWidth = 550;
        const padding = 0;
        const step =
            chartWidth /
            (
                temps.length - 1
            );

        temps.forEach(
            (
                temp,
                i
            ) => {

                const x =
                    padding +
                    (
                        i * step
                    );

                const averageTemp =
                    (
                        maxTemp +
                        minTemp
                    ) / 2;

                const y =
                    60 -
                    (
                        temp -
                        averageTemp
                    ) * 15;

                points.push(
                    `${x},${y}`
                );

                const circle =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "circle"
                    );

                circle.setAttribute(
                    "cx",
                    x
                );

                circle.setAttribute(
                    "cy",
                    y
                );

                circle.setAttribute(
                    "r",
                    "4"
                );

                circle.setAttribute(
                    "class",
                    "temp-point"
                );

                tempPoints.appendChild(
                    circle
                );

            }
        );

        tempLine.setAttribute(
            "points",
            points.join(" ")
        );

        const fillPoints = [

            `${padding},120`,

            ...points,

            `${
                padding +
                (
                    (temps.length - 1)
                    * step
                )
            },120`

        ];

        tempFill.setAttribute(
            "points",
            fillPoints.join(" ")
        );

    }

    catch(error) {

        console.error(
            "FORECAST ERROR"
        );

        console.error(error);

    }

}




async function getAQI() {

    try {

        const response = await fetch(
            "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=35.44&longitude=139.64&current=us_aqi"
        );

        const data =
            await response.json();

        console.log(
            "AQI DATA"
        );

        console.log(
            data
        );

        const aqi =
            data.current.us_aqi;

        document.getElementById(
            "aqi-value"
        ).textContent =
            aqi;

        const statusElement =
            document.getElementById(
                "aqi-status"
            );

        let status = "";

        if (
            aqi <= 50
        ) {

            status =
                "🟢 Good";

            statusElement.style.color =
                "#30D158";

        }

        else if (
            aqi <= 100
        ) {

            status =
                "🟡 Moderate";

            statusElement.style.color =
                "#FFD60A";

        }

        else {

            status =
                "🔴 Unhealthy";

            statusElement.style.color =
                "#FF453A";

        }

        statusElement.textContent =
            status;

    }

    catch(error) {

        console.error(
            "AQI ERROR"
        );

        console.error(
            error
        );

    }

}



async function getHeatIndex() {

    try {

        const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=35.44&longitude=139.64&current=temperature_2m,relative_humidity_2m"
        );

        const data =
            await response.json();

        const temp =
            data.current.temperature_2m;

        const humidity =
            data.current.relative_humidity_2m;

        const heatIndex =
            Math.round(
                temp +
                (
                    humidity / 100
                ) * 5
            );

        document.getElementById(
            "heat-value"
        ).textContent =
            heatIndex;

        const statusElement =
            document.getElementById(
                "heat-status"
            );

        let status = "";

        if (
            heatIndex < 25
        ) {

            status =
                "🟢 Safe";

            statusElement.style.color =
                "#30D158";

        }

        else if (
            heatIndex < 30
        ) {

            status =
                "🟡 Caution";

            statusElement.style.color =
                "#FFD60A";

        }

        else {

            status =
                "🔴 Danger";

            statusElement.style.color =
                "#FF453A";

        }

        statusElement.textContent =
            status;

    }

    catch(error) {

        console.error(
            "HEAT INDEX ERROR"
        );

        console.error(
            error
        );

    }

}


// --------------------
// Run
// --------------------

//setBackgroundByTime();

getWarningData();

getHourlyForecast();

getCurrentWeather();

getAQI();

getHeatIndex();


console.log(
    "DASHBOARD LOADED"
);
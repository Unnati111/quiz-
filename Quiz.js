// JavaScript source code
var myapp = angular.module("myapp", ['googlechart']);
myapp.controller("myctrl", function ($scope, $http) {
    $scope.start = true;
    $scope.option = "none";
    $scope.end = false;
    $scope.showLoader = false;
    $scope.notready = true;
    $scope.getques = function (difficulty) {
        
        $http({
            method: "GET",
            url: "https://docs.google.com/spreadsheets/d/1XKJdhiWzk917SR79ym8e-ZNnBYilH_A_u3g1VnWQD08/edit#gid=0",
            responseType: 'arraybuffer'
        }).then(function mySuccess(response) {
            $scope.showLoader = true;
            $scope.file = (response.data);
            $scope.randomQuestion = [];
            $scope.resultArray = [];
            $scope.resultArray1 = [];
            $scope.show = [];
            var data = new Uint8Array(response.data);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            /* Call XLSX */
            var workbook = XLSX.read(bstr, { type: "binary" });
            /* DO SOMETHING WITH workbook HERE */
            var first_sheet_name = workbook.SheetNames[0];
            /* Get worksheet */
            var worksheet = workbook.Sheets[first_sheet_name];
            var excelRows = (XLSX.utils.sheet_to_json(worksheet));
            var length = excelRows.length;
            var actualkey = {};
            var questions = [];
            var colkey = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            for (var i = 0; i < 8; i++) {
                actualkey[i] = excelRows[0][colkey[i]];
            }
            //console.log(actualkey);
            for (var j = 1; j < length; j++) {
                var temp = {};
                for (var i = 0; i < 8; i++) {
                    temp[actualkey[i]] = excelRows[j][colkey[i]];
                }
                questions.push(temp);
            }
            console.log(questions);
            $scope.resultArray1 = questions.filter((row) => {
                var ignoreValue = Object.values(row).some(elem => elem === undefined);
                return !ignoreValue ? true : false;
            });
            $scope.resultArray = $scope.resultArray1.filter(word => word['Difficulty Level'] == difficulty);

            console.log($scope.resultArray);
            for (var i = 0; i < 4; i++) {
                var elem = $scope.resultArray[Math.floor(Math.random() * $scope.resultArray.length)];
                var index = $scope.randomQuestion.findIndex(x => x.Question === elem.Question);
                if (index == -1) {
                    elem['show'] == false;
                    $scope.randomQuestion.push(elem);
                }
                else if (index != -1 || !elem) {
                    i--;
                }
            }
            console.log($scope.randomQuestion);
            $scope.start = false;
            $scope.randomQuestion[0].show = true;
            $scope.showLoader = false;
        }, function myError(response) {
            $scope.errormsg = "No data Found";
        });
    }

    $scope.next = function (elem) {
        elem['show'] = false;
        var index = $scope.randomQuestion.findIndex(x => x.Question === elem.Question);
        console.log(index);
        $scope.randomQuestion[index + 1].show = true;
    }
    $scope.prev = function (elem) {
        elem['show'] = false;
        var index = $scope.randomQuestion.findIndex(x => x.Question === elem.Question);
        console.log(index);
        $scope.randomQuestion[index - 1].show = true;
    }
    $scope.Submit = function (elem) {
        $scope.notready = true;
        elem['show'] = false;
        $scope.end = true;
        $scope.Score = 0;
        $scope.pieChartObject = {};


        //set chart type
        $scope.pieChartObject.type = "PieChart";

        //set title
        $scope.pieChartObject.options = {
            'title': 'Result'
        };

        for (var x = 0; x < $scope.randomQuestion.length; x++) {
            if ($scope.randomQuestion[x].value == $scope.randomQuestion[x]['Correct Option']) {
                console.log($scope.randomQuestion[x].value);
                $scope.Score++;

            }
        }
        console.log($scope.Score);
        var incorrect = 4 - $scope.Score;
        $scope.pieChartObject.data = {
            "cols": [
                { id: "t", label: "Status", type: "string" },
                { id: "s", label: "Value", type: "number" }
            ], "rows": [
                {
                    c: [
                        { v: "Correct" },
                        { v: $scope.Score },
                    ]
                },
                {
                    c: [
                        { v: "Incorrect" },
                        { v: incorrect },
                    ]
                },

            ]
        };
        $scope.pieChartObject.options = {
            width: 245,
            height: 160,
            title:"Percentage Evaluation",
            colors: ['#82bb30', '#FF0000'],
            is3D: true,
            background: 'black'
        }
        $scope.notready = false;
    }
   

});



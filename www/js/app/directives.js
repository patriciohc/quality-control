app
.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        var binaryString = loadEvent.target.result;
                        var base64 = btoa(binaryString);
                        scope.fileread(base64);
                    });
                }
                reader.readAsBinaryString(changeEvent.target.files[0]);
            });
        }
    }
}]);

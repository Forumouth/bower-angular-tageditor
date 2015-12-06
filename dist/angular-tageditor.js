(function() {
  angular.module("ngTagEditor.controller", []).controller("ngTagEditorController", [
    "$scope", function(scope) {
      var checkModel, popText, pushText;
      checkModel = function(model) {
        if (!(model instanceof Array) && model) {
          throw new Error("ngModel should be an array or empty");
        } else if (!scope.ngModel) {
          return scope.ngModel = [];
        }
      };
      scope.$watch("ngModel", checkModel);
      checkModel(scope.ngModel);
      pushText = function() {
        scope.insertTag(scope.ngModel.length, scope.tmpHolder);
        return delete scope.tmpHolder;
      };
      popText = function() {
        return scope.removeTag(scope.ngModel.length - 1);
      };
      scope.removeTag = function(index) {
        var callArg, value;
        scope.editorClass.maxTagNumExceeded = false;
        value = scope.ngModel.splice(index, 1);
        callArg = {
          "index": index,
          "value": value
        };
        scope.tagChange(callArg);
        scope.tagDel(callArg);
        return delete scope.styles[scope.styles.length - 1];
      };
      scope.insertTag = function(index, value) {
        var callArg, rest;
        if (!scope.tagMaxLength || scope.ngModel.length < scope.tagMaxLength) {
          rest = scope.ngModel.splice(index, scope.ngModel.length, value);
          scope.ngModel = scope.ngModel.concat(rest);
          callArg = {
            "index": index,
            "value": value
          };
          scope.styles[index] = scope.tagChange(callArg) || scope.styles[index];
          return scope.styles[index] = scope.tagAdd(callArg) || scope.styles[index];
        } else {
          return scope.editorClass.maxTagNumExceeded = true;
        }
      };
      scope.blur = function() {
        if (scope.tmpHolder) {
          return pushText();
        }
      };
      scope.keydown = function(event) {
        if (event.keyCode === 8) {
          if (!scope.tmpHolder) {
            popText();
            return event.preventDefault();
          }
        } else if (event.keyCode === 9) {
          scope.blur();
          return event.preventDefault();
        }
      };
      scope.styles = {};
      scope.editorClass = {
        'maxTagNumExceeded': scope.ngModel.length >= scope.tagMaxLength
      };
      return scope.ngModel.forEach(function(tag, index) {
        var style;
        style = scope.tagStyle({
          "value": tag,
          "index": index
        });
        if (style) {
          return scope.styles[index] = style;
        }
      });
    }
  ]);

}).call(this);

(function() {
  angular.module("ngTagEditor", ["ngTagEditor.controller"]).directive("ngTagEditor", [
    function() {
      return {
        "restrict": "AC",
        "scope": {
          "ngModel": "=",
          "tagChange": "&",
          "tagAdd": "&",
          "tagDel": "&",
          "tagStyle": "&",
          "textMaxLength": "=",
          "tagMaxLength": "=",
          "placeholder": "@"
        },
        "replace": true,
        "template": "<ul> <li class=\"tag\" data-ng-repeat=\"item in ngModel track by $index\" data-ng-style=\"styles[$index]\"> <span class=\"tag-body\">{{ item }}</span> <a href=\"javascript:void(0)\" class=\"remove-tag\" data-ng-click=\"removeTag($index)\" >&times;</a> </li> <li class=\"editor\"> <input class=\"editor\" data-ng-model=\"tmpHolder\" data-ng-class=\"editorClass\" placeholder=\"{{ placeholder }}\" maxlength=\"{{ textMaxLength }}\" size=\"{{tmpHolder.length || placeholder.length || 10}}\" data-ng-keydown=\"keydown($event)\" data-ng-blur=\"blur()\"> </li> </ul>",
        "controller": "ngTagEditorController"
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXIuY29mZmVlIiwiZGlyZWN0aXZlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsd0JBQWYsRUFBeUMsRUFBekMsQ0FDRSxDQUFDLFVBREgsQ0FDYyx1QkFEZCxFQUN1QztJQUNyQyxRQURxQyxFQUVyQyxTQUFDLEtBQUQ7QUFDRSxVQUFBO01BQUEsVUFBQSxHQUFhLFNBQUMsS0FBRDtRQUNYLElBQUcsQ0FBQSxDQUFBLEtBQUEsWUFBcUIsS0FBckIsQ0FBQSxJQUErQixLQUFsQztBQUNFLGdCQUFVLElBQUEsS0FBQSxDQUFNLHFDQUFOLEVBRFo7U0FBQSxNQUVLLElBQUcsQ0FBSSxLQUFLLENBQUMsT0FBYjtpQkFDSCxLQUFLLENBQUMsT0FBTixHQUFnQixHQURiOztNQUhNO01BS2IsS0FBSyxDQUFDLE1BQU4sQ0FBYSxTQUFiLEVBQXdCLFVBQXhCO01BQ0EsVUFBQSxDQUFXLEtBQUssQ0FBQyxPQUFqQjtNQUVBLFFBQUEsR0FBVyxTQUFBO1FBQ1QsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUE5QixFQUFzQyxLQUFLLENBQUMsU0FBNUM7ZUFDQSxPQUFPLEtBQUssQ0FBQztNQUZKO01BR1gsT0FBQSxHQUFVLFNBQUE7ZUFDUixLQUFLLENBQUMsU0FBTixDQUFnQixLQUFLLENBQUMsT0FBTyxDQUFDLE1BQWQsR0FBdUIsQ0FBdkM7TUFEUTtNQUVWLEtBQUssQ0FBQyxTQUFOLEdBQWtCLFNBQUMsS0FBRDtBQUNoQixZQUFBO1FBQUEsS0FBSyxDQUFDLFdBQVcsQ0FBQyxpQkFBbEIsR0FBc0M7UUFDdEMsS0FBQSxHQUFRLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBZCxDQUFxQixLQUFyQixFQUE0QixDQUE1QjtRQUNSLE9BQUEsR0FDRTtVQUFBLE9BQUEsRUFBUyxLQUFUO1VBQ0EsT0FBQSxFQUFTLEtBRFQ7O1FBR0YsS0FBSyxDQUFDLFNBQU4s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QkFaRjtRQWtDQSxZQUFBLEVBQWMsdUJBbENkOztJQUZKLENBRDBCO0dBRjVCO0FBQUEiLCJmaWxlIjoiYW5ndWxhci10YWdlZGl0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZShcIm5nVGFnRWRpdG9yLmNvbnRyb2xsZXJcIiwgW1xuXSkuY29udHJvbGxlciBcIm5nVGFnRWRpdG9yQ29udHJvbGxlclwiLCBbXG4gIFwiJHNjb3BlXCJcbiAgKHNjb3BlKSAtPlxuICAgIGNoZWNrTW9kZWwgPSAobW9kZWwpIC0+XG4gICAgICBpZiBtb2RlbCBub3QgaW5zdGFuY2VvZiBBcnJheSBhbmQgbW9kZWxcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwibmdNb2RlbCBzaG91bGQgYmUgYW4gYXJyYXkgb3IgZW1wdHlcIlxuICAgICAgZWxzZSBpZiBub3Qgc2NvcGUubmdNb2RlbFxuICAgICAgICBzY29wZS5uZ01vZGVsID0gW11cbiAgICBzY29wZS4kd2F0Y2ggXCJuZ01vZGVsXCIsIGNoZWNrTW9kZWxcbiAgICBjaGVja01vZGVsIHNjb3BlLm5nTW9kZWxcblxuICAgIHB1c2hUZXh0ID0gLT5cbiAgICAgIHNjb3BlLmluc2VydFRhZyBzY29wZS5uZ01vZGVsLmxlbmd0aCwgc2NvcGUudG1wSG9sZGVyXG4gICAgICBkZWxldGUgc2NvcGUudG1wSG9sZGVyXG4gICAgcG9wVGV4dCA9IC0+XG4gICAgICBzY29wZS5yZW1vdmVUYWcgc2NvcGUubmdNb2RlbC5sZW5ndGggLSAxXG4gICAgc2NvcGUucmVtb3ZlVGFnID0gKGluZGV4KSAtPlxuICAgICAgc2NvcGUuZWRpdG9yQ2xhc3MubWF4VGFnTnVtRXhjZWVkZWQgPSBmYWxzZVxuICAgICAgdmFsdWUgPSBzY29wZS5uZ01vZGVsLnNwbGljZSBpbmRleCwgMVxuICAgICAgY2FsbEFyZyA9IChcbiAgICAgICAgXCJpbmRleFwiOiBpbmRleCxcbiAgICAgICAgXCJ2YWx1ZVwiOiB2YWx1ZVxuICAgICAgKVxuICAgICAgc2NvcGUudGFnQ2hhbmdlIGNhbGxBcmdcbiAgICAgIHNjb3BlLnRhZ0RlbCBjYWxsQXJnXG4gICAgICBkZWxldGUgc2NvcGUuc3R5bGVzW3Njb3BlLnN0eWxlcy5sZW5ndGggLSAxXVxuICAgIHNjb3BlLmluc2VydFRhZyA9IChpbmRleCwgdmFsdWUpIC0+XG4gICAgICBpZiAhc2NvcGUudGFnTWF4TGVuZ3RoIG9yIHNjb3BlLm5nTW9kZWwubGVuZ3RoIDwgc2NvcGUudGFnTWF4TGVuZ3RoXG4gICAgICAgIHJlc3QgPSBzY29wZS5uZ01vZGVsLnNwbGljZSBpbmRleCwgc2NvcGUubmdNb2RlbC5sZW5ndGgsIHZhbHVlXG4gICAgICAgIHNjb3BlLm5nTW9kZWwgPSBzY29wZS5uZ01vZGVsLmNvbmNhdCByZXN0XG4gICAgICAgIGNhbGxBcmcgPSAoXG4gICAgICAgICAgXCJpbmRleFwiOiBpbmRleCxcbiAgICAgICAgICBcInZhbHVlXCI6IHZhbHVlXG4gICAgICAgIClcbiAgICAgICAgc2NvcGUuc3R5bGVzW2luZGV4XSA9IHNjb3BlLnRhZ0NoYW5nZShjYWxsQXJnKSBvciBzY29wZS5zdHlsZXNbaW5kZXhdXG4gICAgICAgIHNjb3BlLnN0eWxlc1tpbmRleF0gPSBzY29wZS50YWdBZGQoY2FsbEFyZykgb3Igc2NvcGUuc3R5bGVzW2luZGV4XVxuICAgICAgZWxzZVxuICAgICAgICBzY29wZS5lZGl0b3JDbGFzcy5tYXhUYWdOdW1FeGNlZWRlZCA9IHRydWVcbiAgICBzY29wZS5ibHVyID0gLT5cbiAgICAgIGlmIHNjb3BlLnRtcEhvbGRlclxuICAgICAgICBwdXNoVGV4dCgpXG4gICAgc2NvcGUua2V5ZG93biA9IChldmVudCkgLT5cbiAgICAgIGlmIGV2ZW50LmtleUNvZGUgaXMgOFxuICAgICAgICBpZiBub3Qgc2NvcGUudG1wSG9sZGVyXG4gICAgICAgICAgcG9wVGV4dCgpXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgZWxzZSBpZiBldmVudC5rZXlDb2RlIGlzIDlcbiAgICAgICAgc2NvcGUuYmx1cigpXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBzY29wZS5zdHlsZXMgPSB7fVxuICAgIHNjb3BlLmVkaXRvckNsYXNzID1cbiAgICAgICdtYXhUYWdOdW1FeGNlZWRlZCc6IHNjb3BlLm5nTW9kZWwubGVuZ3RoID49IHNjb3BlLnRhZ01heExlbmd0aFxuICAgIHNjb3BlLm5nTW9kZWwuZm9yRWFjaCAodGFnLCBpbmRleCkgLT5cbiAgICAgIHN0eWxlID0gc2NvcGUudGFnU3R5bGUgKFxuICAgICAgICBcInZhbHVlXCI6IHRhZ1xuICAgICAgICBcImluZGV4XCI6IGluZGV4XG4gICAgICApXG4gICAgICBpZiBzdHlsZVxuICAgICAgICBzY29wZS5zdHlsZXNbaW5kZXhdID0gc3R5bGVcbl1cbiIsImFuZ3VsYXIubW9kdWxlKFwibmdUYWdFZGl0b3JcIiwgW1xuICBcIm5nVGFnRWRpdG9yLmNvbnRyb2xsZXJcIlxuXSkuZGlyZWN0aXZlKFwibmdUYWdFZGl0b3JcIiwgW1xuICAtPlxuICAgIChcbiAgICAgIFwicmVzdHJpY3RcIjogXCJBQ1wiXG4gICAgICBcInNjb3BlXCI6XG4gICAgICAgIFwibmdNb2RlbFwiOiBcIj1cIlxuICAgICAgICBcInRhZ0NoYW5nZVwiOiBcIiZcIlxuICAgICAgICBcInRhZ0FkZFwiOiBcIiZcIlxuICAgICAgICBcInRhZ0RlbFwiOiBcIiZcIlxuICAgICAgICBcInRhZ1N0eWxlXCI6IFwiJlwiXG4gICAgICAgIFwidGV4dE1heExlbmd0aFwiOiBcIj1cIlxuICAgICAgICBcInRhZ01heExlbmd0aFwiOiBcIj1cIlxuICAgICAgICBcInBsYWNlaG9sZGVyXCI6IFwiQFwiXG4gICAgICBcInJlcGxhY2VcIjogdHJ1ZVxuICAgICAgXCJ0ZW1wbGF0ZVwiOiAoXG4gICAgICAgIFwiPHVsPlxuICAgICAgICAgIDxsaSBjbGFzcz1cXFwidGFnXFxcIiBkYXRhLW5nLXJlcGVhdD1cXFwiaXRlbSBpbiBuZ01vZGVsIHRyYWNrIGJ5ICRpbmRleFxcXCJcbiAgICAgICAgICAgIGRhdGEtbmctc3R5bGU9XFxcInN0eWxlc1skaW5kZXhdXFxcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJ0YWctYm9keVxcXCI+e3sgaXRlbSB9fTwvc3Bhbj5cbiAgICAgICAgICAgIDxhIGhyZWY9XFxcImphdmFzY3JpcHQ6dm9pZCgwKVxcXCJcbiAgICAgICAgICAgICAgY2xhc3M9XFxcInJlbW92ZS10YWdcXFwiXG4gICAgICAgICAgICAgIGRhdGEtbmctY2xpY2s9XFxcInJlbW92ZVRhZygkaW5kZXgpXFxcIlxuICAgICAgICAgICAgPiZ0aW1lczs8L2E+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgICA8bGkgY2xhc3M9XFxcImVkaXRvclxcXCI+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xhc3M9XFxcImVkaXRvclxcXCJcbiAgICAgICAgICAgICAgZGF0YS1uZy1tb2RlbD1cXFwidG1wSG9sZGVyXFxcIlxuICAgICAgICAgICAgICBkYXRhLW5nLWNsYXNzPVxcXCJlZGl0b3JDbGFzc1xcXCJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XFxcInt7IHBsYWNlaG9sZGVyIH19XFxcIlxuICAgICAgICAgICAgICBtYXhsZW5ndGg9XFxcInt7IHRleHRNYXhMZW5ndGggfX1cXFwiXG4gICAgICAgICAgICAgIHNpemU9XFxcInt7dG1wSG9sZGVyLmxlbmd0aCB8fCBwbGFjZWhvbGRlci5sZW5ndGggfHwgMTB9fVxcXCJcbiAgICAgICAgICAgICAgZGF0YS1uZy1rZXlkb3duPVxcXCJrZXlkb3duKCRldmVudClcXFwiXG4gICAgICAgICAgICAgIGRhdGEtbmctYmx1cj1cXFwiYmx1cigpXFxcIj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlwiXG4gICAgICApXG4gICAgICBcImNvbnRyb2xsZXJcIjogXCJuZ1RhZ0VkaXRvckNvbnRyb2xsZXJcIlxuICAgIClcbl0pXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

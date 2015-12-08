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
        var callArg, style, value;
        scope.editorClass.maxTagNumExceeded = false;
        value = scope.ngModel.splice(index, 1);
        callArg = {
          "index": index,
          "value": value
        };
        style = scope.tagChange(callArg);
        style = scope.tagDel(callArg) || style;
        if (style === null) {
          return scope.styles.splice(index, 1);
        } else if (style) {
          return scope.styles[index] = style;
        } else {
          return scope.styles.pop();
        }
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
      scope.styles = [];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXIuY29mZmVlIiwiZGlyZWN0aXZlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsd0JBQWYsRUFBeUMsRUFBekMsQ0FDRSxDQUFDLFVBREgsQ0FDYyx1QkFEZCxFQUN1QztJQUNyQyxRQURxQyxFQUVyQyxTQUFDLEtBQUQ7QUFDRSxVQUFBO01BQUEsVUFBQSxHQUFhLFNBQUMsS0FBRDtRQUNYLElBQUcsQ0FBQSxDQUFBLEtBQUEsWUFBcUIsS0FBckIsQ0FBQSxJQUErQixLQUFsQztBQUNFLGdCQUFVLElBQUEsS0FBQSxDQUFNLHFDQUFOLEVBRFo7U0FBQSxNQUVLLElBQUcsQ0FBSSxLQUFLLENBQUMsT0FBYjtpQkFDSCxLQUFLLENBQUMsT0FBTixHQUFnQixHQURiOztNQUhNO01BS2IsS0FBSyxDQUFDLE1BQU4sQ0FBYSxTQUFiLEVBQXdCLFVBQXhCO01BQ0EsVUFBQSxDQUFXLEtBQUssQ0FBQyxPQUFqQjtNQUVBLFFBQUEsR0FBVyxTQUFBO1FBQ1QsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUE5QixFQUFzQyxLQUFLLENBQUMsU0FBNUM7ZUFDQSxPQUFPLEtBQUssQ0FBQztNQUZKO01BR1gsT0FBQSxHQUFVLFNBQUE7ZUFDUixLQUFLLENBQUMsU0FBTixDQUFnQixLQUFLLENBQUMsT0FBTyxDQUFDLE1BQWQsR0FBdUIsQ0FBdkM7TUFEUTtNQUVWLEtBQUssQ0FBQyxTQUFOLEdBQWtCLFNBQUMsS0FBRDtBQUNoQixZQUFBO1FBQUEsS0FBSyxDQUFDLFdBQVcsQ0FBQyxpQkFBbEIsR0FBc0M7UUFDdEMsS0FBQSxHQUFRLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBZCxDQUFxQixLQUFyQixFQUE0QixDQUE1QjtRQUNSLE9BQUEsR0FDRTtVQUFBLE9BQUEsRUFBUyxLQUFUO1VBQ0EsT0FBQSxFQUFTLEtBRFQ7O1FBR0YsS0FBQSxHQUFRLEtBQUss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QURiO1VBRUEsUUFBQSxFQUFVLEdBRlY7VUFHQSxRQUFBLEVBQVUsR0FIVjtVQUlBLFVBQUEsRUFBWSxHQUpaO1VBS0EsZUFBQSxFQUFpQixHQUxqQjtVQU1BLGNBQUEsRUFBZ0IsR0FOaEI7VUFPQSxhQUFBLEVBQWUsR0FQZjtTQUZGO1FBVUEsU0FBQSxFQUFXLElBVlg7UUFXQSxVQUFBLEVBQ0Usa2pCQVpGO1FBa0NBLFlBQUEsRUFBYyx1QkFsQ2Q7O0lBRkosQ0FEMEI7R0FGNUI7QUFBQSIsImZpbGUiOiJhbmd1bGFyLXRhZ2VkaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKFwibmdUYWdFZGl0b3IuY29udHJvbGxlclwiLCBbXG5dKS5jb250cm9sbGVyIFwibmdUYWdFZGl0b3JDb250cm9sbGVyXCIsIFtcbiAgXCIkc2NvcGVcIlxuICAoc2NvcGUpIC0+XG4gICAgY2hlY2tNb2RlbCA9IChtb2RlbCkgLT5cbiAgICAgIGlmIG1vZGVsIG5vdCBpbnN0YW5jZW9mIEFycmF5IGFuZCBtb2RlbFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJuZ01vZGVsIHNob3VsZCBiZSBhbiBhcnJheSBvciBlbXB0eVwiXG4gICAgICBlbHNlIGlmIG5vdCBzY29wZS5uZ01vZGVsXG4gICAgICAgIHNjb3BlLm5nTW9kZWwgPSBbXVxuICAgIHNjb3BlLiR3YXRjaCBcIm5nTW9kZWxcIiwgY2hlY2tNb2RlbFxuICAgIGNoZWNrTW9kZWwgc2NvcGUubmdNb2RlbFxuXG4gICAgcHVzaFRleHQgPSAtPlxuICAgICAgc2NvcGUuaW5zZXJ0VGFnIHNjb3BlLm5nTW9kZWwubGVuZ3RoLCBzY29wZS50bXBIb2xkZXJcbiAgICAgIGRlbGV0ZSBzY29wZS50bXBIb2xkZXJcbiAgICBwb3BUZXh0ID0gLT5cbiAgICAgIHNjb3BlLnJlbW92ZVRhZyBzY29wZS5uZ01vZGVsLmxlbmd0aCAtIDFcbiAgICBzY29wZS5yZW1vdmVUYWcgPSAoaW5kZXgpIC0+XG4gICAgICBzY29wZS5lZGl0b3JDbGFzcy5tYXhUYWdOdW1FeGNlZWRlZCA9IGZhbHNlXG4gICAgICB2YWx1ZSA9IHNjb3BlLm5nTW9kZWwuc3BsaWNlIGluZGV4LCAxXG4gICAgICBjYWxsQXJnID0gKFxuICAgICAgICBcImluZGV4XCI6IGluZGV4LFxuICAgICAgICBcInZhbHVlXCI6IHZhbHVlXG4gICAgICApXG4gICAgICBzdHlsZSA9IHNjb3BlLnRhZ0NoYW5nZSBjYWxsQXJnXG4gICAgICBzdHlsZSA9IHNjb3BlLnRhZ0RlbChjYWxsQXJnKSBvciBzdHlsZVxuICAgICAgaWYgc3R5bGUgaXMgbnVsbFxuICAgICAgICBzY29wZS5zdHlsZXMuc3BsaWNlIGluZGV4LCAxXG4gICAgICBlbHNlIGlmIHN0eWxlXG4gICAgICAgIHNjb3BlLnN0eWxlc1tpbmRleF0gPSBzdHlsZVxuICAgICAgZWxzZVxuICAgICAgICBzY29wZS5zdHlsZXMucG9wKClcbiAgICBzY29wZS5pbnNlcnRUYWcgPSAoaW5kZXgsIHZhbHVlKSAtPlxuICAgICAgaWYgIXNjb3BlLnRhZ01heExlbmd0aCBvciBzY29wZS5uZ01vZGVsLmxlbmd0aCA8IHNjb3BlLnRhZ01heExlbmd0aFxuICAgICAgICByZXN0ID0gc2NvcGUubmdNb2RlbC5zcGxpY2UgaW5kZXgsIHNjb3BlLm5nTW9kZWwubGVuZ3RoLCB2YWx1ZVxuICAgICAgICBzY29wZS5uZ01vZGVsID0gc2NvcGUubmdNb2RlbC5jb25jYXQgcmVzdFxuICAgICAgICBjYWxsQXJnID0gKFxuICAgICAgICAgIFwiaW5kZXhcIjogaW5kZXgsXG4gICAgICAgICAgXCJ2YWx1ZVwiOiB2YWx1ZVxuICAgICAgICApXG4gICAgICAgIHNjb3BlLnN0eWxlc1tpbmRleF0gPSBzY29wZS50YWdDaGFuZ2UoY2FsbEFyZykgb3Igc2NvcGUuc3R5bGVzW2luZGV4XVxuICAgICAgICBzY29wZS5zdHlsZXNbaW5kZXhdID0gc2NvcGUudGFnQWRkKGNhbGxBcmcpIG9yIHNjb3BlLnN0eWxlc1tpbmRleF1cbiAgICAgIGVsc2VcbiAgICAgICAgc2NvcGUuZWRpdG9yQ2xhc3MubWF4VGFnTnVtRXhjZWVkZWQgPSB0cnVlXG4gICAgc2NvcGUuYmx1ciA9IC0+XG4gICAgICBpZiBzY29wZS50bXBIb2xkZXJcbiAgICAgICAgcHVzaFRleHQoKVxuICAgIHNjb3BlLmtleWRvd24gPSAoZXZlbnQpIC0+XG4gICAgICBpZiBldmVudC5rZXlDb2RlIGlzIDhcbiAgICAgICAgaWYgbm90IHNjb3BlLnRtcEhvbGRlclxuICAgICAgICAgIHBvcFRleHQoKVxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIGVsc2UgaWYgZXZlbnQua2V5Q29kZSBpcyA5XG4gICAgICAgIHNjb3BlLmJsdXIoKVxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgc2NvcGUuc3R5bGVzID0gW11cbiAgICBzY29wZS5lZGl0b3JDbGFzcyA9XG4gICAgICAnbWF4VGFnTnVtRXhjZWVkZWQnOiBzY29wZS5uZ01vZGVsLmxlbmd0aCA+PSBzY29wZS50YWdNYXhMZW5ndGhcbiAgICBzY29wZS5uZ01vZGVsLmZvckVhY2ggKHRhZywgaW5kZXgpIC0+XG4gICAgICBzdHlsZSA9IHNjb3BlLnRhZ1N0eWxlIChcbiAgICAgICAgXCJ2YWx1ZVwiOiB0YWdcbiAgICAgICAgXCJpbmRleFwiOiBpbmRleFxuICAgICAgKVxuICAgICAgaWYgc3R5bGVcbiAgICAgICAgc2NvcGUuc3R5bGVzW2luZGV4XSA9IHN0eWxlXG5dXG4iLCJhbmd1bGFyLm1vZHVsZShcIm5nVGFnRWRpdG9yXCIsIFtcbiAgXCJuZ1RhZ0VkaXRvci5jb250cm9sbGVyXCJcbl0pLmRpcmVjdGl2ZShcIm5nVGFnRWRpdG9yXCIsIFtcbiAgLT5cbiAgICAoXG4gICAgICBcInJlc3RyaWN0XCI6IFwiQUNcIlxuICAgICAgXCJzY29wZVwiOlxuICAgICAgICBcIm5nTW9kZWxcIjogXCI9XCJcbiAgICAgICAgXCJ0YWdDaGFuZ2VcIjogXCImXCJcbiAgICAgICAgXCJ0YWdBZGRcIjogXCImXCJcbiAgICAgICAgXCJ0YWdEZWxcIjogXCImXCJcbiAgICAgICAgXCJ0YWdTdHlsZVwiOiBcIiZcIlxuICAgICAgICBcInRleHRNYXhMZW5ndGhcIjogXCI9XCJcbiAgICAgICAgXCJ0YWdNYXhMZW5ndGhcIjogXCI9XCJcbiAgICAgICAgXCJwbGFjZWhvbGRlclwiOiBcIkBcIlxuICAgICAgXCJyZXBsYWNlXCI6IHRydWVcbiAgICAgIFwidGVtcGxhdGVcIjogKFxuICAgICAgICBcIjx1bD5cbiAgICAgICAgICA8bGkgY2xhc3M9XFxcInRhZ1xcXCIgZGF0YS1uZy1yZXBlYXQ9XFxcIml0ZW0gaW4gbmdNb2RlbCB0cmFjayBieSAkaW5kZXhcXFwiXG4gICAgICAgICAgICBkYXRhLW5nLXN0eWxlPVxcXCJzdHlsZXNbJGluZGV4XVxcXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwidGFnLWJvZHlcXFwiPnt7IGl0ZW0gfX08L3NwYW4+XG4gICAgICAgICAgICA8YSBocmVmPVxcXCJqYXZhc2NyaXB0OnZvaWQoMClcXFwiXG4gICAgICAgICAgICAgIGNsYXNzPVxcXCJyZW1vdmUtdGFnXFxcIlxuICAgICAgICAgICAgICBkYXRhLW5nLWNsaWNrPVxcXCJyZW1vdmVUYWcoJGluZGV4KVxcXCJcbiAgICAgICAgICAgID4mdGltZXM7PC9hPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgPGxpIGNsYXNzPVxcXCJlZGl0b3JcXFwiPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzPVxcXCJlZGl0b3JcXFwiXG4gICAgICAgICAgICAgIGRhdGEtbmctbW9kZWw9XFxcInRtcEhvbGRlclxcXCJcbiAgICAgICAgICAgICAgZGF0YS1uZy1jbGFzcz1cXFwiZWRpdG9yQ2xhc3NcXFwiXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVxcXCJ7eyBwbGFjZWhvbGRlciB9fVxcXCJcbiAgICAgICAgICAgICAgbWF4bGVuZ3RoPVxcXCJ7eyB0ZXh0TWF4TGVuZ3RoIH19XFxcIlxuICAgICAgICAgICAgICBzaXplPVxcXCJ7e3RtcEhvbGRlci5sZW5ndGggfHwgcGxhY2Vob2xkZXIubGVuZ3RoIHx8IDEwfX1cXFwiXG4gICAgICAgICAgICAgIGRhdGEtbmcta2V5ZG93bj1cXFwia2V5ZG93bigkZXZlbnQpXFxcIlxuICAgICAgICAgICAgICBkYXRhLW5nLWJsdXI9XFxcImJsdXIoKVxcXCI+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cIlxuICAgICAgKVxuICAgICAgXCJjb250cm9sbGVyXCI6IFwibmdUYWdFZGl0b3JDb250cm9sbGVyXCJcbiAgICApXG5dKVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

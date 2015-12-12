(function() {
  angular.module("ngTagEditor.controller", []).controller("ngTagEditorController", [
    "$scope", "$compile", function(scope, compile) {
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
        if (scope.tmpHolder !== void 0) {
          scope.tmpHolder = scope.tmpHolder.trim();
          if (scope.tmpHolder) {
            return pushText();
          }
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
      scope.$watch("measure.offsetWidth", function(width) {
        return scope.editorStyle.width = width + "px";
      });
      scope.editorStyle = {
        "width": "auto"
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
    "$compile", function(compile) {
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
        "template": "<ul> <li class=\"tag\" data-ng-repeat=\"item in ngModel track by $index\" data-ng-style=\"styles[$index]\"> <span class=\"tag-body\">{{ item }}</span> <a href=\"javascript:void(0)\" class=\"remove-tag\" data-ng-click=\"removeTag($index)\" >&times;</a> </li> <li class=\"editor\"> <input class=\"editor\" data-ng-model=\"tmpHolder\" data-ng-class=\"editorClass\" data-ng-style=\"editorStyle\" data-ng-trim=\"false\" placeholder=\"{{ placeholder }}\" maxlength=\"{{ textMaxLength }}\" data-ng-keydown=\"keydown($event)\" data-ng-blur=\"blur()\"> </li> </ul>",
        "controller": "ngTagEditorController",
        "link": function(scope, element) {
          var measure;
          scope.__measure_style__ = {
            "opacity": 0,
            "white-space": "pre",
            "visibility": "hidden",
            "position": "absolute"
          };
          measure = compile(angular.element("<span class=\"editor measure\" data-ng-style=\"__measure_style__\"> {{ tmpHolder || placeholder }} </span>"))(scope);
          element.append(measure);
          return scope.measure = measure[0];
        }
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXIuY29mZmVlIiwiZGlyZWN0aXZlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsd0JBQWYsRUFBeUMsRUFBekMsQ0FDRSxDQUFDLFVBREgsQ0FDYyx1QkFEZCxFQUN1QztJQUNyQyxRQURxQyxFQUMzQixVQUQyQixFQUVyQyxTQUFDLEtBQUQsRUFBUSxPQUFSO0FBQ0UsVUFBQTtNQUFBLFVBQUEsR0FBYSxTQUFDLEtBQUQ7UUFDWCxJQUFHLENBQUEsQ0FBQSxLQUFBLFlBQXFCLEtBQXJCLENBQUEsSUFBK0IsS0FBbEM7QUFDRSxnQkFBVSxJQUFBLEtBQUEsQ0FBTSxxQ0FBTixFQURaO1NBQUEsTUFFSyxJQUFHLENBQUksS0FBSyxDQUFDLE9BQWI7aUJBQ0gsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsR0FEYjs7TUFITTtNQUtiLEtBQUssQ0FBQyxNQUFOLENBQWEsU0FBYixFQUF3QixVQUF4QjtNQUNBLFVBQUEsQ0FBVyxLQUFLLENBQUMsT0FBakI7TUFFQSxRQUFBLEdBQVcsU0FBQTtRQUNULEtBQUssQ0FBQyxTQUFOLENBQWdCLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBOUIsRUFBc0MsS0FBSyxDQUFDLFNBQTVDO2VBQ0EsT0FBTyxLQUFLLENBQUM7TUFGSjtNQUdYLE9BQUEsR0FBVSxTQUFBO2VBQ1IsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFkLEdBQXVCLENBQXZDO01BRFE7TUFFVixLQUFLLENBQUMsU0FBTixHQUFrQixTQUFDLEtBQUQ7QUFDaEIsWUFBQTtRQUFBLEtBQUssQ0FBQyxXQUFXLENBQUMsaUJBQWxCLEdBQXNDO1FBQ3RDLEtBQUEsR0FBUSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQWQsQ0FBcUIsS0FBckIsRUFBNEIsQ0FBNUI7UUFDUixPQUFBLEdBQ0U7VUFBQSxPQUFBLEVBQVMsS0FBVDtVQUNBLE9BQUEsRUFBUyxLQURU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SUFBRyxLQUFIO2lCQUNFLEtBQUssQ0FBQyxNQUFPLENBQUEsS0FBQSxDQUFiLEdBQXNCLE1BRHhCOztNQUxvQixDQUF0QjtJQTdERixDQUZxQztHQUR2QztBQUFBOzs7QUNBQTtFQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsYUFBZixFQUE4QixDQUM1Qix3QkFENEIsQ0FBOUIsQ0FFRSxDQUFDLFNBRkgsQ0FFYSxhQUZiLEVBRTRCO0lBQzFCLFVBRDBCLEVBRTFCLFNBQUMsT0FBRDthQUVJO1FBQUEsVUFBQSxFQUFZLElBQVo7UUFDQSxPQUFBLEVBQ0U7VUFBQSxTQUFBLEVBQVcsR0FBWDtVQUNBLFdBQUEsRUFBYSxHQURiO1VBRUEsUUFBQSxFQUFVLEdBRlY7VUFHQSxRQUFBLEVBQVUsR0FIVjtVQUlBLFVBQUEsRUFBWSxHQUpaO1VBS0EsZUFBQSxFQUFpQixHQUxqQjtVQU1BLGNBQUEsRUFBZ0IsR0FOaEI7VUFPQSxhQUFBLEVBQWUsR0FQZjtTQUZGO1FBVUEsU0FBQSxFQUFXLElBVlg7UUFXQSxVQUFBLEVBQ0UsNmlCQVpGO1FBbUNBLFlBQUEsRUFBYyx1QkFuQ2Q7UUFvQ0EsTUFBQSxFQUFRLFNBQUMsS0FBRCxFQUFRLE9BQVI7QUFDTixjQUFBO1VBQUEsS0FBSyxDQUFDLGlCQUFOLEdBQ0U7WUFBQSxTQUFBLEVBQVcsQ0FBWDtZQUNBLGFBQUEsRUFBZSxLQURmO1lBRUEsWUFBQSxFQUFjLFFBRmQ7WUFHQSxVQUFBLEVBQVksVUFIWjs7VUFJRixPQUFBLEdBQVUsT0FBQSxDQUNSLE9BQU8sQ0FBQyxPQUFSLENBQ0UsNEdBREYsQ0FEUSxDQUFBLENBT1IsS0FQUTtVQVFWLE9BQU8sQ0FBQyxNQUFSLENBQWUsT0FBZjtpQkFDQSxLQUFLLENBQUMsT0FBTixHQUFnQixPQUFRLENBQUEsQ0FBQTtRQWZsQixDQXBDUjs7SUFGSixDQUYwQjtHQUY1QjtBQUFBIiwiZmlsZSI6ImFuZ3VsYXItdGFnZWRpdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoXCJuZ1RhZ0VkaXRvci5jb250cm9sbGVyXCIsIFtcbl0pLmNvbnRyb2xsZXIgXCJuZ1RhZ0VkaXRvckNvbnRyb2xsZXJcIiwgW1xuICBcIiRzY29wZVwiLCBcIiRjb21waWxlXCJcbiAgKHNjb3BlLCBjb21waWxlKSAtPlxuICAgIGNoZWNrTW9kZWwgPSAobW9kZWwpIC0+XG4gICAgICBpZiBtb2RlbCBub3QgaW5zdGFuY2VvZiBBcnJheSBhbmQgbW9kZWxcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwibmdNb2RlbCBzaG91bGQgYmUgYW4gYXJyYXkgb3IgZW1wdHlcIlxuICAgICAgZWxzZSBpZiBub3Qgc2NvcGUubmdNb2RlbFxuICAgICAgICBzY29wZS5uZ01vZGVsID0gW11cbiAgICBzY29wZS4kd2F0Y2ggXCJuZ01vZGVsXCIsIGNoZWNrTW9kZWxcbiAgICBjaGVja01vZGVsIHNjb3BlLm5nTW9kZWxcblxuICAgIHB1c2hUZXh0ID0gLT5cbiAgICAgIHNjb3BlLmluc2VydFRhZyBzY29wZS5uZ01vZGVsLmxlbmd0aCwgc2NvcGUudG1wSG9sZGVyXG4gICAgICBkZWxldGUgc2NvcGUudG1wSG9sZGVyXG4gICAgcG9wVGV4dCA9IC0+XG4gICAgICBzY29wZS5yZW1vdmVUYWcgc2NvcGUubmdNb2RlbC5sZW5ndGggLSAxXG4gICAgc2NvcGUucmVtb3ZlVGFnID0gKGluZGV4KSAtPlxuICAgICAgc2NvcGUuZWRpdG9yQ2xhc3MubWF4VGFnTnVtRXhjZWVkZWQgPSBmYWxzZVxuICAgICAgdmFsdWUgPSBzY29wZS5uZ01vZGVsLnNwbGljZSBpbmRleCwgMVxuICAgICAgY2FsbEFyZyA9IChcbiAgICAgICAgXCJpbmRleFwiOiBpbmRleCxcbiAgICAgICAgXCJ2YWx1ZVwiOiB2YWx1ZVxuICAgICAgKVxuICAgICAgc3R5bGUgPSBzY29wZS50YWdDaGFuZ2UgY2FsbEFyZ1xuICAgICAgc3R5bGUgPSBzY29wZS50YWdEZWwoY2FsbEFyZykgb3Igc3R5bGVcbiAgICAgIGlmIHN0eWxlIGlzIG51bGxcbiAgICAgICAgc2NvcGUuc3R5bGVzLnNwbGljZSBpbmRleCwgMVxuICAgICAgZWxzZSBpZiBzdHlsZVxuICAgICAgICBzY29wZS5zdHlsZXNbaW5kZXhdID0gc3R5bGVcbiAgICAgIGVsc2VcbiAgICAgICAgc2NvcGUuc3R5bGVzLnBvcCgpXG4gICAgc2NvcGUuaW5zZXJ0VGFnID0gKGluZGV4LCB2YWx1ZSkgLT5cbiAgICAgIGlmICFzY29wZS50YWdNYXhMZW5ndGggb3Igc2NvcGUubmdNb2RlbC5sZW5ndGggPCBzY29wZS50YWdNYXhMZW5ndGhcbiAgICAgICAgcmVzdCA9IHNjb3BlLm5nTW9kZWwuc3BsaWNlIGluZGV4LCBzY29wZS5uZ01vZGVsLmxlbmd0aCwgdmFsdWVcbiAgICAgICAgc2NvcGUubmdNb2RlbCA9IHNjb3BlLm5nTW9kZWwuY29uY2F0IHJlc3RcbiAgICAgICAgY2FsbEFyZyA9IChcbiAgICAgICAgICBcImluZGV4XCI6IGluZGV4LFxuICAgICAgICAgIFwidmFsdWVcIjogdmFsdWVcbiAgICAgICAgKVxuICAgICAgICBzY29wZS5zdHlsZXNbaW5kZXhdID0gc2NvcGUudGFnQ2hhbmdlKGNhbGxBcmcpIG9yIHNjb3BlLnN0eWxlc1tpbmRleF1cbiAgICAgICAgc2NvcGUuc3R5bGVzW2luZGV4XSA9IHNjb3BlLnRhZ0FkZChjYWxsQXJnKSBvciBzY29wZS5zdHlsZXNbaW5kZXhdXG4gICAgICBlbHNlXG4gICAgICAgIHNjb3BlLmVkaXRvckNsYXNzLm1heFRhZ051bUV4Y2VlZGVkID0gdHJ1ZVxuICAgIHNjb3BlLmJsdXIgPSAtPlxuICAgICAgaWYgc2NvcGUudG1wSG9sZGVyIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgIHNjb3BlLnRtcEhvbGRlciA9IHNjb3BlLnRtcEhvbGRlci50cmltKClcbiAgICAgICAgaWYgc2NvcGUudG1wSG9sZGVyXG4gICAgICAgICAgcHVzaFRleHQoKVxuICAgIHNjb3BlLmtleWRvd24gPSAoZXZlbnQpIC0+XG4gICAgICBpZiBldmVudC5rZXlDb2RlIGlzIDhcbiAgICAgICAgaWYgbm90IHNjb3BlLnRtcEhvbGRlclxuICAgICAgICAgIHBvcFRleHQoKVxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIGVsc2UgaWYgZXZlbnQua2V5Q29kZSBpcyA5XG4gICAgICAgIHNjb3BlLmJsdXIoKVxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgc2NvcGUuc3R5bGVzID0gW11cbiAgICBzY29wZS5lZGl0b3JDbGFzcyA9XG4gICAgICAnbWF4VGFnTnVtRXhjZWVkZWQnOiBzY29wZS5uZ01vZGVsLmxlbmd0aCA+PSBzY29wZS50YWdNYXhMZW5ndGhcbiAgICBzY29wZS4kd2F0Y2ggXCJtZWFzdXJlLm9mZnNldFdpZHRoXCIsICh3aWR0aCkgLT5cbiAgICAgIHNjb3BlLmVkaXRvclN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCJcbiAgICBzY29wZS5lZGl0b3JTdHlsZSA9XG4gICAgICBcIndpZHRoXCI6IFwiYXV0b1wiXG4gICAgc2NvcGUubmdNb2RlbC5mb3JFYWNoICh0YWcsIGluZGV4KSAtPlxuICAgICAgc3R5bGUgPSBzY29wZS50YWdTdHlsZSAoXG4gICAgICAgIFwidmFsdWVcIjogdGFnXG4gICAgICAgIFwiaW5kZXhcIjogaW5kZXhcbiAgICAgIClcbiAgICAgIGlmIHN0eWxlXG4gICAgICAgIHNjb3BlLnN0eWxlc1tpbmRleF0gPSBzdHlsZVxuXVxuIiwiYW5ndWxhci5tb2R1bGUoXCJuZ1RhZ0VkaXRvclwiLCBbXG4gIFwibmdUYWdFZGl0b3IuY29udHJvbGxlclwiXG5dKS5kaXJlY3RpdmUoXCJuZ1RhZ0VkaXRvclwiLCBbXG4gIFwiJGNvbXBpbGVcIlxuICAoY29tcGlsZSkgLT5cbiAgICAoXG4gICAgICBcInJlc3RyaWN0XCI6IFwiQUNcIlxuICAgICAgXCJzY29wZVwiOlxuICAgICAgICBcIm5nTW9kZWxcIjogXCI9XCJcbiAgICAgICAgXCJ0YWdDaGFuZ2VcIjogXCImXCJcbiAgICAgICAgXCJ0YWdBZGRcIjogXCImXCJcbiAgICAgICAgXCJ0YWdEZWxcIjogXCImXCJcbiAgICAgICAgXCJ0YWdTdHlsZVwiOiBcIiZcIlxuICAgICAgICBcInRleHRNYXhMZW5ndGhcIjogXCI9XCJcbiAgICAgICAgXCJ0YWdNYXhMZW5ndGhcIjogXCI9XCJcbiAgICAgICAgXCJwbGFjZWhvbGRlclwiOiBcIkBcIlxuICAgICAgXCJyZXBsYWNlXCI6IHRydWVcbiAgICAgIFwidGVtcGxhdGVcIjogKFxuICAgICAgICBcIjx1bD5cbiAgICAgICAgICA8bGkgY2xhc3M9XFxcInRhZ1xcXCIgZGF0YS1uZy1yZXBlYXQ9XFxcIml0ZW0gaW4gbmdNb2RlbCB0cmFjayBieSAkaW5kZXhcXFwiXG4gICAgICAgICAgICBkYXRhLW5nLXN0eWxlPVxcXCJzdHlsZXNbJGluZGV4XVxcXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwidGFnLWJvZHlcXFwiPnt7IGl0ZW0gfX08L3NwYW4+XG4gICAgICAgICAgICA8YSBocmVmPVxcXCJqYXZhc2NyaXB0OnZvaWQoMClcXFwiXG4gICAgICAgICAgICAgIGNsYXNzPVxcXCJyZW1vdmUtdGFnXFxcIlxuICAgICAgICAgICAgICBkYXRhLW5nLWNsaWNrPVxcXCJyZW1vdmVUYWcoJGluZGV4KVxcXCJcbiAgICAgICAgICAgID4mdGltZXM7PC9hPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgPGxpIGNsYXNzPVxcXCJlZGl0b3JcXFwiPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIGNsYXNzPVxcXCJlZGl0b3JcXFwiXG4gICAgICAgICAgICAgIGRhdGEtbmctbW9kZWw9XFxcInRtcEhvbGRlclxcXCJcbiAgICAgICAgICAgICAgZGF0YS1uZy1jbGFzcz1cXFwiZWRpdG9yQ2xhc3NcXFwiXG4gICAgICAgICAgICAgIGRhdGEtbmctc3R5bGU9XFxcImVkaXRvclN0eWxlXFxcIlxuICAgICAgICAgICAgICBkYXRhLW5nLXRyaW09XFxcImZhbHNlXFxcIlxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cXFwie3sgcGxhY2Vob2xkZXIgfX1cXFwiXG4gICAgICAgICAgICAgIG1heGxlbmd0aD1cXFwie3sgdGV4dE1heExlbmd0aCB9fVxcXCJcbiAgICAgICAgICAgICAgZGF0YS1uZy1rZXlkb3duPVxcXCJrZXlkb3duKCRldmVudClcXFwiXG4gICAgICAgICAgICAgIGRhdGEtbmctYmx1cj1cXFwiYmx1cigpXFxcIj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlwiXG4gICAgICApXG4gICAgICBcImNvbnRyb2xsZXJcIjogXCJuZ1RhZ0VkaXRvckNvbnRyb2xsZXJcIixcbiAgICAgIFwibGlua1wiOiAoc2NvcGUsIGVsZW1lbnQpIC0+XG4gICAgICAgIHNjb3BlLl9fbWVhc3VyZV9zdHlsZV9fID1cbiAgICAgICAgICBcIm9wYWNpdHlcIjogMFxuICAgICAgICAgIFwid2hpdGUtc3BhY2VcIjogXCJwcmVcIlxuICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcImhpZGRlblwiXG4gICAgICAgICAgXCJwb3NpdGlvblwiOiBcImFic29sdXRlXCJcbiAgICAgICAgbWVhc3VyZSA9IGNvbXBpbGUoXG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KFxuICAgICAgICAgICAgXCI8c3BhbiBjbGFzcz1cXFwiZWRpdG9yIG1lYXN1cmVcXFwiXG4gICAgICAgICAgICAgIGRhdGEtbmctc3R5bGU9XFxcIl9fbWVhc3VyZV9zdHlsZV9fXFxcIj5cbiAgICAgICAgICAgICAge3sgdG1wSG9sZGVyIHx8IHBsYWNlaG9sZGVyIH19XG4gICAgICAgICAgICAgPC9zcGFuPlwiXG4gICAgICAgICAgKVxuICAgICAgICApKHNjb3BlKVxuICAgICAgICBlbGVtZW50LmFwcGVuZCBtZWFzdXJlXG4gICAgICAgIHNjb3BlLm1lYXN1cmUgPSBtZWFzdXJlWzBdXG4gICAgKVxuXSlcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

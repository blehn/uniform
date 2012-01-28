/*

Uniform v1.7.5
Copyright © 2009 Josh Pyles / Pixelmatrix Design LLC
http://pixelmatrixdesign.com

Requires jQuery 1.3 or newer

Much thanks to Thomas Reynolds and Buck Wilson for their help and advice on this

Disabling text selection is made possible by Mathias Bynens <http://mathiasbynens.be/>
and his noSelect plugin. <http://github.com/mathiasbynens/noSelect-jQuery-Plugin>

Also, thanks to David Kaneda and Eugene Bond for their contributions to the plugin

License:
MIT License - http://www.opensource.org/licenses/mit-license.php

Enjoy!

*/

(function ($, undefined) {
  $.uniform = {
    options: {
      selectClass:   'selector',
      radioClass: 'radio',
      checkboxClass: 'checker',
      fileClass: 'uploader',
      filenameClass: 'filename',
      fileBtnClass: 'action',
      fileDefaultText: 'No file selected',
      fileBtnText: 'Choose File',
      checkedClass: 'checked',
      focusClass: 'focus',
      disabledClass: 'disabled',
      buttonClass: 'button',
      activeClass: 'active',
      hoverClass: 'hover',
      useID: true,
      idPrefix: 'uniform',
      resetSelector: false,
      autoHide: true,
      selectAutoWidth: false
    },
    elements: []
  };

  if($.browser.msie && $.browser.version < 7){
    $.support.selectOpacity = false;
  }else{
    $.support.selectOpacity = true;
  }

  $.fn.uniform = function (options) {

    options = $.extend({}, $.uniform.options, options);

    var el = this;
    //code for specifying a reset button
    if (options.resetSelector !== false) {
      $(options.resetSelector).mouseup(function () {
        function resetThis() {
          $.uniform.update(el);
        }
        window.setTimeout(resetThis, 10);
      });
    }
    
    function doInput(elem){
      var $el = $(elem);
      $el.addClass($el.attr("type"));
      storeElement(elem);
    }
    
    function doTextarea(elem){
      $(elem).addClass("uniform");
      storeElement(elem);
    }
    
    function doButton(elem){
      var $el = $(elem);
      
      var divTag = $("<div>"),
          spanTag = $("<span>");
      
      divTag.addClass(options.buttonClass);
      
      if(options.useID && $el.attr("id")) divTag.attr("id", options.idPrefix+"-"+$el.attr("id"));
      
      var btnText;
      
      if($el.is("a") || $el.is("button")){
        btnText = $el.text();
      }else if($el.is(":submit") || $el.is(":reset") || $el.is("input[type=button]")){
        btnText = $el.attr("value");
      }
      
      btnText = btnText == "" ? $el.is(":reset") ? "Reset" : "Submit" : btnText;
      
      spanTag.html(btnText);
      
      $el.css("opacity", 0);
      $el.wrap(divTag);
      $el.wrap(spanTag);
      
      //redefine variables
      divTag = $el.closest("div");
      spanTag = $el.closest("span");
      
      if($el.is(":disabled")) divTag.addClass(options.disabledClass);
      
      divTag
      .bind("mouseenter.uniform", function(){
        divTag.addClass(options.hoverClass);
      })
      .bind("mouseleave.uniform", function(){
        divTag.removeClass(options.hoverClass);
        divTag.removeClass(options.activeClass);
      })
      .bind("mousedown.uniform touchbegin.uniform", function(){
        divTag.addClass(options.activeClass);
      })
      .bind("mouseup.uniform touchend.uniform", function(){
        divTag.removeClass(options.activeClass);
      })
      .bind("click.uniform touchend.uniform", function(e){
        if($(e.target).is("span") || $(e.target).is("div")){    
          if(elem[0].dispatchEvent){
            var ev = document.createEvent('MouseEvents');
            ev.initEvent( 'click', true, true );
            elem[0].dispatchEvent(ev);
          }else{
            elem[0].click();
          }
        }
      });
      
      elem
      .bind("focus.uniform", function(){
        divTag.addClass(options.focusClass);
      })
      .bind("blur.uniform", function(){
        divTag.removeClass(options.focusClass);
      });
      
      $.uniform.noSelect(divTag);
      storeElement(elem);
      
    }

    function doSelect(elem) {
      var $el = $(elem);
      
      var divTag = $('<div />'),
          spanTag = $('<span />');
      
      if($el.css("display") == "none" && options.autoHide){
        divTag.hide();
      }

      divTag.addClass(options.selectClass);

      /**
       * Thanks to @MaxEvron @kjantzer and @furkanmustafa from GitHub
       */
      if(options.selectAutoWidth){
        var origElemWidth = $el.width();
        var origDivWidth = divTag.width();
        var origSpanWidth = spanTag.width();
        var adjustDiff = origSpanWidth-origElemWidth;
        divTag.width(origDivWidth - adjustDiff + 25);
        $el.width(origElemWidth + 32);
        $el.css('left','2px');
        spanTag.width(origElemWidth);
      }

      if(options.useID && elem.attr("id")){
        divTag.attr("id", options.idPrefix+"-"+elem.attr("id"));
      }
      
      var selected = elem.find(":selected:first");
      if(selected.length == 0){
        selected = elem.find("option:first");
      }
      spanTag.html(selected.html());
      
      elem.css('opacity', 0);
      elem.wrap(divTag);
      elem.before(spanTag);

      //redefine variables
      divTag = elem.parent("div");
      spanTag = elem.siblings("span");

      elem
      .bind("change.uniform", function() {
        spanTag.text(elem.find(":selected").html());
        divTag.removeClass(options.activeClass);
      })
      .bind("focus.uniform", function() {
        divTag.addClass(options.focusClass);
      })
      .bind("blur.uniform", function() {
        divTag.removeClass(options.focusClass);
        divTag.removeClass(options.activeClass);
      })
      .bind("mousedown.uniform touchbegin.uniform", function() {
        divTag.addClass(options.activeClass);
      })
      .bind("mouseup.uniform touchend.uniform", function() {
        divTag.removeClass(options.activeClass);
      })
      .bind("click.uniform touchend.uniform", function(){
        divTag.removeClass(options.activeClass);
      })
      .bind("mouseenter.uniform", function() {
        divTag.addClass(options.hoverClass);
      })
      .bind("mouseleave.uniform", function() {
        divTag.removeClass(options.hoverClass);
        divTag.removeClass(options.activeClass);
      })
      .bind("keyup.uniform", function(){
        spanTag.text(elem.find(":selected").html());
      });
      
      //handle disabled state
      if($el.is(":disabled")){
        //box is checked by default, check our box
        divTag.addClass(options.disabledClass);
      }
      $.uniform.noSelect(spanTag);
      
      storeElement(elem);

    }

    function doCheckbox(elem){
      var $el = $(elem);
      
      var divTag = $('<div />'),
          spanTag = $('<span />');
      
      if($el.css("display") == "none" && options.autoHide){
        divTag.hide();
      }
      
      divTag.addClass(options.checkboxClass);

      //assign the id of the element
      if(options.useID && elem.attr("id")){
        divTag.attr("id", options.idPrefix+"-"+elem.attr("id"));
      }

      //wrap with the proper elements
      $el.wrap(divTag);
      $el.wrap(spanTag);

      //redefine variables
      spanTag = elem.parent();
      divTag = spanTag.parent();

      //hide normal input and add focus classes
      $el
      .css("opacity", 0)
      .bind("focus.uniform", function(){
        divTag.addClass(options.focusClass);
      })
      .bind("blur.uniform", function(){
        divTag.removeClass(options.focusClass);
      })
      .bind("click.uniform touchend.uniform", function(){
          if ( $el.is(":checked") ) {
            // the checkbox is clicked by user and its state was un checked
            // so just add checked class and attribute
            $(elem).attr("checked", "checked");
            spanTag.addClass(options.checkedClass);
          } else {
            // user click checkbox when its state was checked, so we'll need to 
            // remove the checked class from span and attribute of the checkbox element
            $(elem).removeAttr("checked");
            spanTag.removeClass(options.checkedClass);
          }
        }
      })
      .bind("mousedown.uniform touchbegin.uniform", function() {
        divTag.addClass(options.activeClass);
      })
      .bind("mouseup.uniform touchend.uniform", function() {
        divTag.removeClass(options.activeClass);
      })
      .bind("mouseenter.uniform", function() {
        divTag.addClass(options.hoverClass);
      })
      .bind("mouseleave.uniform", function() {
        divTag.removeClass(options.hoverClass);
        divTag.removeClass(options.activeClass);
      });
      
      //handle defaults
      if($el.is(":checked")){
        $el.attr("checked", "checked"); // helpful when its by-default checked
        //box is checked by default, check our box
        spanTag.addClass(options.checkedClass);
      }

      //handle disabled state
      if($el.is(":disabled")){
        //box is disabled by default, disable our box
        divTag.addClass(options.disabledClass);
      }

      storeElement(elem);
    }

    function doRadio(elem){
      var $el = $(elem);
      
      var divTag = $('<div />'),
          spanTag = $('<span />');
          
      if($el.css("display") == "none" && options.autoHide){
        divTag.hide();
      }

      divTag.addClass(options.radioClass);

      if(options.useID && elem.attr("id")){
        divTag.attr("id", options.idPrefix+"-"+elem.attr("id"));
      }

      //wrap with the proper elements
      $el.wrap(divTag);
      $el.wrap(spanTag);

      //redefine variables
      spanTag = elem.parent();
      divTag = spanTag.parent();

      //hide normal input and add focus classes
      $el
      .css("opacity", 0)
      .bind("focus.uniform", function(){
        divTag.addClass(options.focusClass);
      })
      .bind("blur.uniform", function(){
        divTag.removeClass(options.focusClass);
      })
      .bind("click.uniform touchend.uniform", function(){
        if(!$(elem).is(":checked")){
          //box was just unchecked, uncheck span
          spanTag.removeClass(options.checkedClass);
        }else{
          //box was just checked, check span
          var classes = options.radioClass.split(" ")[0];
          $("." + classes + " span." + options.checkedClass + ":has([name='" + $(elem).attr('name') + "'])").removeClass(options.checkedClass);
          spanTag.addClass(options.checkedClass);
        }
      })
      .bind("mousedown.uniform touchend.uniform", function() {
        if(!$(elem).is(":disabled")){
          divTag.addClass(options.activeClass);
        }
      })
      .bind("mouseup.uniform touchbegin.uniform", function() {
        divTag.removeClass(options.activeClass);
      })
      .bind("mouseenter.uniform touchend.uniform", function() {
        divTag.addClass(options.hoverClass);
      })
      .bind("mouseleave.uniform", function() {
        divTag.removeClass(options.hoverClass);
        divTag.removeClass(options.activeClass);
      });

      //handle defaults
      if($el.is(":checked")){
        //box is checked by default, check span
        spanTag.addClass(options.checkedClass);
      }
      //handle disabled state
      if($el.is(":disabled")){
        //box is checked by default, check our box
        divTag.addClass(options.disabledClass);
      }

      storeElement(elem);

    }

    function doFile(elem) {
      //sanitize input
      var $el = $(elem);

      var divTag = $('<div />'),
          filenameTag = $('<span>'+options.fileDefaultText+'</span>'),
          btnTag = $('<span>'+options.fileBtnText+'</span>');
      
      if($el.css("display") == "none" && options.autoHide){
        divTag.hide();
      }

      divTag.addClass(options.fileClass);
      filenameTag.addClass(options.filenameClass);
      btnTag.addClass(options.fileBtnClass);

      if(options.useID && $el.attr("id")){
        divTag.attr("id", options.idPrefix+"-"+$el.attr("id"));
      }

      //wrap with the proper elements
      $el.wrap(divTag);
      $el.after(btnTag);
      $el.after(filenameTag);

      //redefine variables
      divTag = $el.closest("div");
      filenameTag = $el.siblings("." + options.filenameClass);
      btnTag = $el.siblings("." + options.fileBtnClass);

      //set the size
      if (!$el.attr("size")) {
        $el.attr("size", divTag.width() / 10);
      }

      //actions
      var setFilename = function()
      {
        var filename = $el.val();
        if (filename === '')
        {
          filename = options.fileDefaultText;
        }
        else
        {
          filename = filename.split(/[\/\\]+/);
          filename = filename[(filename.length-1)];
        }
        filenameTag.text(filename);
      };

      // Account for input saved across refreshes
      setFilename();

      $el
      .css("opacity", 0)
      .bind("focus.uniform", function(){
        divTag.addClass(options.focusClass);
      })
      .bind("blur.uniform", function(){
        divTag.removeClass(options.focusClass);
      })
      .bind("mousedown.uniform", function() {
        if(!$(elem).is(":disabled")){
          divTag.addClass(options.activeClass);
        }
      })
      .bind("mouseup.uniform", function() {
        divTag.removeClass(options.activeClass);
      })
      .bind("mouseenter.uniform", function() {
        divTag.addClass(options.hoverClass);
      })
      .bind("mouseleave.uniform", function() {
        divTag.removeClass(options.hoverClass);
        divTag.removeClass(options.activeClass);
      });

      // IE7 doesn't fire onChange until blur or second fire.
      if ($.browser.msie){
        // IE considers browser chrome blocking I/O, so it
        // suspends tiemouts until after the file has been selected.
        $el.bind('click.uniform.ie7', function() {
          setTimeout(setFilename, 0);
        });
      }else{
        // All other browsers behave properly
        $el.bind('change.uniform', setFilename);
      }

      //handle defaults
      if($el.is(":disabled")){
        //box is checked by default, check our box
        divTag.addClass(options.disabledClass);
      }
      
      $.uniform.noSelect(filenameTag);
      $.uniform.noSelect(btnTag);
      
      storeElement(elem);

    }
    
    $.uniform.restore = function(elem){
      if(elem == undefined){
        elem = $($.uniform.elements);
      }
      
      $(elem).each(function(){
        if($(this).is(":checkbox")){
          //unwrap from span and div
          $(this).unwrap().unwrap();
        }else if($(this).is("select")){
          //remove sibling span
          $(this).siblings("span").remove();
          //unwrap parent div
          $(this).unwrap();
        }else if($(this).is(":radio")){
          //unwrap from span and div
          $(this).unwrap().unwrap();
        }else if($(this).is(":file")){
          //remove sibling spans
          $(this).siblings("span").remove();
          //unwrap parent div
          $(this).unwrap();
        }else if($(this).is("button, :submit, :reset, a, input[type='button']")){
          //unwrap from span and div
          $(this).unwrap().unwrap();
        }
        
        //unbind events
        $(this).unbind(".uniform");
        
        //reset inline style
        $(this).css("opacity", "1");
        
        //remove item from list of uniformed elements
        var index = $.inArray($(elem), $.uniform.elements);
        $.uniform.elements.splice(index, 1);
      });
    };

    function storeElement(elem) {
      //store this element in our global array
      elem = elem.get();
      if (elem.length > 1) {
        $.each(elem, function (i, val) {
          $.uniform.elements.push(val);
        });
      } else {
        $.uniform.elements.push(elem);
      }
    }
    
    //noSelect v1.0
    $.uniform.noSelect = function(elem) {
      function f() {
       return false;
      };
      $(elem).each(function() {
       this.onselectstart = this.ondragstart = f; // Webkit & IE
       $(this)
        .mousedown(f) // Webkit & Opera
        .css({ MozUserSelect: 'none' }); // Firefox
      });
     };

    $.uniform.update = function(elem){
      if(elem == undefined){
        elem = $($.uniform.elements);
      }
      //sanitize input
      elem = $(elem);

      elem.each(function () {
        //do to each item in the selector
        //function to reset all classes
        var $e = $(this);

        if ($e.is("select")) {
          //element is a select
          var spanTag = $e.siblings("span");
          var divTag = $e.parent("div");

          divTag.removeClass(options.hoverClass + " " + options.focusClass + " " + options.activeClass);

          //reset current selected text
          spanTag.html($e.find(":selected").html());

          if ($e.is(":disabled")) {
            divTag.addClass(options.disabledClass);
          } else {
            divTag.removeClass(options.disabledClass);
          }

        } else if ($e.is(":checkbox")) {
          //element is a checkbox
          var spanTag = $e.closest("span");
          var divTag = $e.closest("div");

          divTag.removeClass(options.hoverClass + " " + options.focusClass + " " + options.activeClass);
          spanTag.removeClass(options.checkedClass);

          if ($e.is(":checked")) {
            spanTag.addClass(options.checkedClass);
          }
          if ($e.is(":disabled")) {
            divTag.addClass(options.disabledClass);
          } else {
            divTag.removeClass(options.disabledClass);
          }

        } else if ($e.is(":radio")) {
          //element is a radio
          var spanTag = $e.closest("span");
          var divTag = $e.closest("div");

          divTag.removeClass(options.hoverClass + " " + options.focusClass + " " + options.activeClass);
          spanTag.removeClass(options.checkedClass);

          if ($e.is(":checked")) {
            spanTag.addClass(options.checkedClass);
          }

          if ($e.is(":disabled")) {
            divTag.addClass(options.disabledClass);
          } else {
            divTag.removeClass(options.disabledClass);
          }
        } else if ($e.is(":file")){
          var divTag = $e.parent("div");
          var filenameTag = $e.siblings("."+options.filenameClass);
          btnTag = $e.siblings(options.fileBtnClass);

          divTag.removeClass(options.hoverClass + " " + options.focusClass + " " + options.activeClass);

          filenameTag.text($e.val());

          if ($e.is(":disabled")) {
            divTag.addClass(options.disabledClass);
          } else {
            divTag.removeClass(options.disabledClass);
          }
        } else if ($e.is(":submit") || $e.is(":reset") || $e.is("button") || $e.is("a") || elem.is("input[type=button]")){
          var divTag = $e.closest("div");
          divTag.removeClass(options.hoverClass+" "+options.focusClass+" "+options.activeClass);
          
          if ($e.is(":disabled")){
            divTag.addClass(options.disabledClass);
          } else {
            divTag.removeClass(options.disabledClass);
          }
          
        }
        
      });
    };

    return this.each(function() {
      if($.support.selectOpacity){
        var elem = $(this);
        if(!elem.hasClass("unified")) {
          if(elem.is("select")){
            //element is a select
            if(!this.multiple){
              //element is not a multi-select
              if(elem.attr("size") == undefined || elem.attr("size") <= 1){
                doSelect(elem);
              }
            }
          }else if(elem.is(":checkbox")){
            //element is a checkbox
            doCheckbox(elem);
          }else if(elem.is(":radio")){
            //element is a radio
            doRadio(elem);
          }else if(elem.is(":file")){
            //element is a file upload
            doFile(elem);
          }else if(elem.is(":text, :password, input[type='email']")){
            doInput(elem);
          }else if(elem.is("textarea")){
            doTextarea(elem);
          }else if(elem.is("a") || elem.is(":submit") || elem.is(":reset") || elem.is("button") || elem.is("input[type=button]")){
            doButton(elem);
          }
          elem.addClass("unified");
        }
      }
    });
  };
})(jQuery);

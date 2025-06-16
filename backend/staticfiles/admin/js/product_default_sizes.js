(function($) {
  console.log("Product default sizes fihwoJF;EAHBJefhagiubjNFHEAGIBHhakbofuaibkhJOHFIKH FKIHscript loaded");
  // use whichever jQuery is available in the admin
  $ = (typeof django !== "undefined" && django.jQuery) ? django.jQuery : window.jQuery;

  // bind only to actual category-selection changes
  $(document).on("change", "select[name='category']", function(){
    var catId = $(this).val();
    if (!catId) return;

    // call your AJAX endpoint
    var url = "/admin/products/product/default-sizes/" + catId + "/";

    $.getJSON(url, function(data){
      // only override if this category has defaults
      if (data.sizes.length > 0) {
        $('input[name="sizes"]').prop("checked", false)
          .filter(function(){
            return data.sizes.includes(+this.value);
          })
          .prop("checked", true);
      }
    });
  });

})(window.jQuery);

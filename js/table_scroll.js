$(document).ready(function() {
	
	/** 凍結表格欄位  */
	function moveScroll() {
		var scroll = $(window).scrollTop();
		var $targetTable = $('.active table');
		if($targetTable.length>0) {
			var anchor_top = $targetTable.offset().top;
			var anchor_bottom = $(".active #bottom_anchor").offset().top;
			if (scroll>anchor_top && scroll<anchor_bottom) {
				var clone_table = $("#clone");
				if(clone_table.length == 0){
					clone_table = $targetTable.clone();
					clone_table.attr('id', 'clone');
					clone_table.css({position:'fixed',
							'pointer-events': 'none',
							top:0});
					clone_table.width($targetTable.width());
					$(".active #table-container").append(clone_table);
					$("#clone").css({visibility:'hidden'});
					$("#clone thead").css({visibility:'visible'});
				}
			} else {
				$("#clone").remove();
			}
		}
		
	}
	$(window).scroll(moveScroll);
});
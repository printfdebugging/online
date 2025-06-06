/* global describe it cy require beforeEach */

var helper = require('../../common/helper');
var desktopHelper = require('../../common/desktop_helper');

describe(['tagdesktop'], 'Image Operation Tests', function() {

	beforeEach(function() {
		helper.setupAndLoadDocument('calc/image_operation.ods');
		desktopHelper.switchUIToNotebookbar();
	});

	it('Insert/Delete Image',function() {
		desktopHelper.insertImage('calc');

		//make sure that image is in focus
		cy.cGet('#document-container svg g').should('exist');

		desktopHelper.deleteImage();
	});

	it('Crop Image', function() {
		desktopHelper.insertImage('calc');

		helper.assertImageSize(248, 63);

		cy.cGet('#test-div-shape-handle-3').should('exist');
		cy.cGet('#Crop').should('be.visible');
		cy.cGet('#Crop').click();

		cy.cGet('#test-div-shape-handle-3').then(($handle) => {
			const rect = $handle[0].getBoundingClientRect();
			const startX = rect.left + rect.width / 2;
			const startY = rect.top + rect.height / 2;
			const moveX = 50;

			cy.cGet('body').realMouseDown({ x: startX, y: startY });

			cy.cGet('body').realMouseMove(startX + moveX, startY);

			cy.cGet('body').realMouseUp();
		});

		cy.wait(1000);
		helper.assertImageSize(198, 63);
	});

	it.skip('Resize image when keep ratio option enabled and disabled', function() {
		desktopHelper.insertImage('calc');
		//when Keep ratio is unchecked
		helper.assertImageSize(248, 63);

		cy.cGet().contains('.ui-expander-label', 'Position and Size')
			.click();

		cy.cGet('#selectwidth input').type('{selectAll}{backspace}3{enter}');

		cy.cGet('#selectheight input').type('{selectAll}{backspace}2{enter}');

		helper.assertImageSize(139, 93);

		//Keep ratio checked
		cy.cGet('#ratio input').check();

		cy.cGet('#selectheight input').type('{selectAll}{backspace}5{enter}');

		helper.assertImageSize(347, 232);
	});
});

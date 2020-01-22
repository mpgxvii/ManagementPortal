import { $, browser, by, element } from 'protractor';

describe('SourceType e2e test', () => {

    const username = element(by.id('username'));
    const password = element(by.id('password'));
    const entityMenu = element(by.id('entity-menu'));
    const accountMenu = element(by.id('account-menu'));
    const login = element(by.id('login'));
    const logout = element(by.id('logout'));

    beforeAll(async() => {
        await browser.get('#');

        await accountMenu.click();
        await login.click();

        await username.sendKeys('admin');
        await password.sendKeys('admin');
        await element(by.css('button[type=submit]')).click();
        await browser.waitForAngular();
    });

    it('should load SourceTypes', async() => {
        await entityMenu.click();
        await element.all(by.css('[routerLink="source-type"]')).first().click();
        const expectVal = /managementPortalApp.sourceType.home.title/;

        const pageTitle = element.all(by.css('h2 span')).first();
        expect((await pageTitle.getAttribute('jhiTranslate'))).toMatch(expectVal);
    });

    it('should load create SourceType dialog', async() => {
        await element(by.css('button.create-source-type')).click();

        const expectVal = /managementPortalApp.sourceType.home.createOrEditLabel/;
        const modalTitle = element.all(by.css('h4.modal-title')).first();
        expect((await modalTitle.getAttribute('jhiTranslate'))).toMatch(expectVal);

        await element(by.css('button.close')).click();
    });

    it('should be able to create SourceType', async() => {
        await element(by.css('button.create-source-type')).click();
        await element(by.id('field_producer')).sendKeys('test-producer');
        await element(by.id('field_model')).sendKeys('test-model');
        await element(by.id('field_catalogVersion')).sendKeys('v1');
        // select first option in the source type scope dropdown
        await element(by.id('field_sourceTypeScope')).all(by.tagName('option')).first().click();
        await element(by.css('jhi-source-type-dialog')).element(by.buttonText('Save')).click();
    });

    it('should be able to edit SourceType', async() => {
        await browser.waitForAngular();
        await element(by.cssContainingText('td', 'test-producer')).element(by.xpath('ancestor::tr'))
            .element(by.cssContainingText('button', 'Edit')).click();
        await browser.waitForAngular();
        await element(by.cssContainingText('button.btn-primary', 'Save')).click();
    });

    it('should be able to delete SourceType', async() => {
        await element(by.cssContainingText('td', 'test-producer')).element(by.xpath('ancestor::tr'))
            .element(by.cssContainingText('button', 'Delete')).click();
        await browser.waitForAngular();
        await element(by.cssContainingText('jhi-source-type-delete-dialog button.btn-danger', 'Delete')).click();
    });

    afterAll(async() => {
        await accountMenu.click();
        await logout.click();
    });
});

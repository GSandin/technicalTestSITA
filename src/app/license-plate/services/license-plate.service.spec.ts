import { TestBed } from "@angular/core/testing";
import { LicensePlateService } from "./license-plate.service";

/**
 * Test suite for License plate Service
 *
 * In this test suite is used to verify each increment of quantity of letters
 * is good implemented.
 */

describe('LicensePlateService', () => {

  let service: LicensePlateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LicensePlateService],
    });
    service = TestBed.inject(LicensePlateService);
  });

  it('should generate license all number', () => {
    let license = service.generateLicense(1);
    expect(license).toEqual('000001');

    license = service.generateLicense(500);
    expect(license).toEqual('000500');

    license = service.generateLicense(45604);
    expect(license).toEqual('045604');

    license = service.generateLicense(999999);
    expect(license).toEqual('999999');
  });

  it('should generate license one letter and rest numbers', () => {
    let license = service.generateLicense(1_000_001);
    expect(license).toEqual('00001A');

    license = service.generateLicense(1_005_000);
    expect(license).toEqual('05000A');

    license = service.generateLicense(1_099_999);
    expect(license).toEqual('99999A');

    license = service.generateLicense(1_100_001);
    expect(license).toEqual('00001B');

    license = service.generateLicense(1_500_001);
    expect(license).toEqual('00001F');

    license = service.generateLicense(3_599_999);
    expect(license).toEqual('99999Z');
  });

  it('should generate license two letters and rest numbers', () => {
    let license = service.generateLicense(3_600_001);
    expect(license).toEqual('0001AA');

    license = service.generateLicense(3_600_500);
    expect(license).toEqual('0500AA');

    license = service.generateLicense(3_609_999);
    expect(license).toEqual('9999AA');

    license = service.generateLicense(3_610_001);
    expect(license).toEqual('0001AB');
  });

  it('should generate license three letters and rest numbers', () => {
    let license = service.generateLicense(10_360_001);
    expect(license).toEqual('001AAA');

    license = service.generateLicense(10_360_500);
    expect(license).toEqual('500AAA');

    license = service.generateLicense(10_360_999);
    expect(license).toEqual('999AAA');

    license = service.generateLicense(10_387_001);
    expect(license).toEqual('001ABB');
  });

  it('should generate license four letters and rest numbers', () => {
    let license = service.generateLicense(27_936_001);
    expect(license).toEqual('01AAAA');

    license = service.generateLicense(27_936_099);
    expect(license).toEqual('99AAAA');

    license = service.generateLicense(27_938_500);
    expect(license).toEqual('00AAAZ');

    license = service.generateLicense(27_938_600);
    expect(license).toEqual('00AABA');
  });

  it('should generate license five letters and rest numbers', () => {
    let license = service.generateLicense(73_633_600);
    expect(license).toEqual('0AAAAA');

    license = service.generateLicense(73_633_601);
    expect(license).toEqual('1AAAAA');

    license = service.generateLicense(73_633_609);
    expect(license).toEqual('9AAAAA');

    license = service.generateLicense(74_196_434);
    expect(license).toEqual('4ADFGT');
  });

  it('should generate license six letters and rest numbers', () => {
    let license = service.generateLicense(192_447_360);
    expect(license).toEqual('AAAAAA');

    license = service.generateLicense(200_729_157);
    expect(license).toEqual('ASDFER');

    license = service.generateLicense(327_093_251);
    expect(license).toEqual('LIQUID');

    license = service.generateLicense(501_363_135);
    expect(license).toEqual('ZZZZZZ');
  });

  it('should trow error because index out of range', () => {
    try {
      service.generateLicense(-1);
    } catch (error: any) {
      expect(error.message).toEqual('Index out of range');
    }
    try {
      service.generateLicense(501_363_136);
    } catch (error: any) {
      expect(error.message).toEqual('Index out of range');
    }
  })

});

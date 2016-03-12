import expect from 'expect';
import { warning } from '../../src/automation';

describe('automation', () => {
  it('should give no warning with no files', () => {
    expect(warning({})).toEqual(undefined);
  });

  it('should warn about a jekyll config without a gemfile', () => {
    expect(warning({'_config.yml': true})).toMatch(/jekyll/i);
  });

  it('should warn about a jekyll site without jekyll in the Gemfile', () => {
    expect(warning({'_config.yml': true, Gemfile: 'middleman'})).toMatch(/Gemfile/);
  });

  it('should not warn about a well configured jekyll site', () => {
    expect(warning({'_config.yml': true, Gemfile: 'gem "jekyll"'})).toBe(undefined);
  })

  it('should warn about a broken package.json file', () => {
    expect(warning({'package.json': '{'})).toMatch(/package.json/);
  });

  it('should warn about roots without a roots dependency', () => {
    expect(warning({'package.json': '{}', 'app.coffee': true})).toMatch(/roots/);
  });

});

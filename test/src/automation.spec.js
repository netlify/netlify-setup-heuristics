import expect from 'expect';
import { warning, settings } from '../../src/automation';

describe('automation', () => {
  describe('warning', () => {
    it('should give no warning with no files', () => {
      expect(warning({})).toBe(undefined);
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

  describe('settings', () => {
    it('should guess no settings with no files', () => {
      expect(settings({})).toBe(undefined);
    });

    it('should guess a typical jekyll setup', () => {
      expect(settings({Gemfile: 'gem "jekyll"'})).toEqual({
        cmd: 'jekyll build',
        dir: '_site/'
      });
    });

    it('should guess a typical middleman setup', () => {
      expect(settings({Gemfile: 'gem "middleman"'})).toEqual({
        cmd: 'middleman build',
        dir: 'build/'
      });
    });

    it('should guess a typical roots setup', () => {
      expect(settings({'package.json': '{"dependencies": {"roots": "3.1.0"}}'})).toEqual({
        cmd: 'roots compile',
        dir: 'public/'
      });
    });

    it('should guess a typical pelican setup', () => {
      expect(settings({'requirements.txt': 'pelican==3.6.3'})).toEqual({
        cmd: 'pelican content',
        dir: 'output/'
      });
    });

    it('should guess a cactus setup', () => {
      expect(settings({'requirements.txt': 'cactus'})).toEqual({
        cmd: 'cactus build',
        dir: '.build/'
      });
    });

    it('should pick up settings from netlify.tml file', () => {
      expect(settings({'netlify.toml': '[build]\ncommand = "npm run build"\npublish = "dist"'})).toEqual({
        cmd: "npm run build",
        dir: "dist"
      });
    })

    it('should read template from netlify.tml file', () => {
      expect(settings({'netlify.toml': '[template]\nincoming-hooks = ["Service-1"]'})).toEqual({
        template: {"incoming-hooks": ["Service-1"]}
      });
    })
  });
});

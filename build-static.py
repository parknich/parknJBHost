# TODO: Work at any base URL location

import argparse
import hashlib
import json
import os
import shutil
import sys
from urllib.parse import quote

SCRIPT_LOC = os.path.realpath(__file__)
CWD = os.path.dirname(SCRIPT_LOC)

def getCategories():
  output = {}

  for entry in os.scandir(os.path.join(CWD, 'exploits')):
    if entry.is_dir(follow_symlinks=False):
      new_data = {}
      finished_data = { entry.name: { 'title': entry.name, 'device': '', 'firmware': '', 'user_agents': [], 'notes': { 'default': ''}, 'offline': False } }
      try:
        with open(os.path.join(CWD, 'exploits', entry.name, 'meta.json')) as buf:
          new_data = json.loads(buf.read())
      except (IOError, PermissionError, json.decoder.JSONDecodeError):
        pass

      try:
        del new_data['title']
      except KeyError:
        pass
      finished_data[entry.name].update(new_data)
      output.update(finished_data)

  if output == {}:
    print('Error generating cateory data')
    sys.exit(1)

  return output

def getEntries(entry_path):
  output = {}

  for entry in os.scandir(os.path.join(CWD, 'exploits', entry_path)):
    if entry.is_dir(follow_symlinks=False):
      new_data = {}
      finished_data = { entry.name: { 'title': entry.name, 'version': '', 'updated': '2001-01-01T00:00:0.0000Z', 'device': '', 'firmware': '', 'description': { 'default': '' }, 'author': '', 'url': '', 'redirect': True, 'reload': False, 'offline': False } }
      try:
        with open(os.path.join(CWD, 'exploits', entry_path, entry.name, 'meta.json')) as buf:
          new_data = json.loads(buf.read())
      except (IOError, PermissionError, json.decoder.JSONDecodeError):
        pass

      try:
        del new_data['title']
      except KeyError:
        pass
      finished_data[entry.name].update(new_data)
      output.update(finished_data)

  if output == {}:
    print('Error generating entry data')
    sys.exit(1)

  return output

def getMenu():
  categories = getCategories()

  for key, value in categories.items():
    categories[key]['entries'] = getEntries(key)

  return categories

def getSettings(settingsFile):
  # TODO
  return ''

def getThemesManifest():
  search_loc = os.path.join(CWD, 'themes')
  hasher = hashlib.md5()

  manifest = 'CACHE MANIFEST\n\n'
  manifest += 'CACHE:\n'

  manifest += '/\n'
  manifest += 'index.html\n'
  manifest += '/index.html\n'
  manifest += '/blank.html\n'
  manifest += '/api/settings\n'
  manifest += '/api/menu\n'

  for path, subdirs, files in os.walk(search_loc):
    for filename in files:
      if not filename.endswith('.es6'): # Maybe exclued dotfiles and delete them in the clean up phase
        with open(os.path.join(path, filename), 'rb') as buf:
          data = buf.read()
        hasher.update(data)
        manifest += quote(os.path.join(path, filename).replace(CWD, '').replace('\\', '/'), safe=';,/?:@&=+$-_.!~*\'()#') + '\n'

  manifest += '\nNETWORK:\n'
  manifest += '*\n'

  manifest += '\nSETTINGS:\n'
  manifest += 'prefer-online\n'

  manifest += '\n# Hash: {}'.format(hasher.hexdigest().upper())

  return manifest

def getAllManifest():
  search_loc = os.path.join(CWD, 'exploits')
  hasher = hashlib.md5()

  manifest = 'CACHE MANIFEST\n\n'
  manifest += 'CACHE:\n'

  for path, subdirs, files in os.walk(search_loc):
    for filename in files:
      if filename != 'meta.json' and filename != 'PUT EXPLOITS HERE':
        with open(os.path.join(path, filename), 'rb') as buf:
          data = buf.read()
        hasher.update(data)
        manifest += quote(os.path.join(path, filename).replace(CWD, '').replace('\\', '/'), safe=';,/?:@&=+$-_.!~*\'()#') + '\n'

  manifest += '\nNETWORK:\n'
  manifest += '*\n'

  manifest += '\n# Hash: {}'.format(hasher.hexdigest().upper())

  return manifest

def getCategoryManifest(category):
  search_loc = os.path.join(CWD, 'exploits', category)
  hasher = hashlib.md5()

  manifest = 'CACHE MANIFEST\n\n'
  manifest += 'CACHE:\n'

  for path, subdirs, files in os.walk(search_loc):
    for filename in files:
      if filename != 'meta.json':
        with open(os.path.join(path, filename), 'rb') as buf:
          data = buf.read()
        hasher.update(data)
        manifest += quote(os.path.join(path, filename).replace(CWD, '').replace('\\', '/'), safe=';,/?:@&=+$-_.!~*\'()#') + '\n'

  manifest += '\nNETWORK:\n'
  manifest += '*\n'

  manifest += '\n# Hash: {}'.format(hasher.hexdigest().upper())

  return manifest

def getEntryManifest(category, entry):
  search_loc = os.path.join(CWD, 'exploits', category, entry)
  hasher = hashlib.md5()

  manifest = 'CACHE MANIFEST\n\n'
  manifest += 'CACHE:\n'

  for path, subdirs, files in os.walk(search_loc):
    for filename in files:
      if filename != 'meta.json':
        with open(os.path.join(path, filename), 'rb') as buf:
          data = buf.read()
        hasher.update(data)
        manifest += quote(os.path.join(path, filename).replace(CWD, '').replace('\\', '/'), safe=';,/?:@&=+$-_.!~*\'()#') + '\n'

  manifest += '\nNETWORK:\n'
  manifest += '*\n'

  manifest += '\n# Hash: {}'.format(hasher.hexdigest().upper())

  return manifest

def main():
  parser = argparse.ArgumentParser(description='PS4 Exploit Host Static Builder')
  parser.add_argument('--output', dest='output', action='store',
                      default=os.path.join(CWD, 'output'),
                      required=False, help='Specify a output location')
  parser.add_argument('--settings', dest='settings', action='store',
                      default=os.path.join(CWD, 'settings.json'),
                      required=False, help='Specify a settings file')
  args = parser.parse_args()

  try:
    shutil.rmtree(args.output)
  except NotADirectoryError:
    print('Error, specified location already exists as a file')
    sys.exit(1)
  except FileNotFoundError:
    pass
  while os.path.exists(args.output):
    pass
  os.makedirs(args.output)

  # --- Add theme redirector --------------------------------------------------
  with open(os.path.join(args.output, 'index.html'), 'w+') as buf:
    buf.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Theme Loader</title></head><body><script id="theme-loader">"use strict";2!=="; ".concat(document.cookie).split("; theme=").length&&(document.cookie="theme=Default; expires=Tue, 19 Jan 2038 03:14:07 UTC;");var xhrThemeLoader=new XMLHttpRequest;xhrThemeLoader.open("GET","/themes/".concat("; ".concat(document.cookie).split("; theme=").pop().split(";").shift(),"/index.html"),!0),xhrThemeLoader.onload=function(){200<=xhrThemeLoader.status&&400>xhrThemeLoader.status?(document.write(xhrThemeLoader.responseText),document.close()):"Default"==="; ".concat(document.cookie).split("; theme=").pop().split(";").shift()?alert("Error retrieving default theme data. Check your setup."):(document.cookie="theme=default; expires=Tue, 19 Jan 2038 03:14:07 UTC;",alert("Error retrieving theme data, resetting theme to default and reloading"),window.location.reload())},xhrThemeLoader.onerror=function(){alert("Error retrieving theme data, try reloading")},xhrThemeLoader.send();</script></body></html>')

  # --- Add blank.html --------------------------------------------------------
  with open(os.path.join(args.output, 'blank.html'), 'w+') as buf:
    buf.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Deus Machina</title></head><body><pre>ZmzJCgLnJ43j2FK4NUR/EmFc7hJRN7Ub4adlqCRLfsXoswDsjyvn5vGwLj2FZdOlVLNmi/l0mjiuHgCYSZqPSndVhg6U8ODSl1+/aDxQLZE=</pre></body></html>')

  # --- Copy News -------------------------------------------------------------
  shutil.copy(os.path.join(CWD, 'news.json'), os.path.join(args.output, 'news'))

  # --- Copy Themes------------------------------------------------------------
  shutil.copytree(os.path.join(CWD, 'themes'), os.path.join(args.output, 'themes'))

  # --- Copy Exploits ---------------------------------------------------------
  shutil.copytree(os.path.join(CWD, 'exploits'), os.path.join(args.output, 'exploits'))

  # --- Add APIs --------------------------------------------------------------
  os.makedirs(os.path.join(args.output, 'api'))

  # Generate Menu
  menu = getMenu()

  # Add /api/menu
  with open(os.path.join(args.output, 'api', 'menu'), 'w+') as buf:
    buf.write(json.dumps(menu, indent=2, sort_keys=True))

  # Add /api/settings
  with open(os.path.join(args.output, 'api', 'settings'), 'w+') as buf:
    buf.write(json.dumps(getSettings(args.settings), indent=2, sort_keys=True))

  # Add /api/static
  with open(os.path.join(args.output, 'api', 'static'), 'w+') as buf:
    buf.write('true')

  # --- Add Cachers -----------------------------------------------------------

  os.makedirs(os.path.join(args.output, 'cache', 'theme'))
  os.makedirs(os.path.join(args.output, 'cache', 'all'))
  os.makedirs(os.path.join(args.output, 'cache', 'category'))
  os.makedirs(os.path.join(args.output, 'cache', 'entry'))

  # Theme Cacher
  with open(os.path.join(args.output, 'cache', 'theme', 'index.html'), 'w+') as buf:
    buf.write('<!DOCTYPE html><html manifest="/themes.manifest"><head><meta charset="utf-8"><title>Cacher</title></head><body><script>"use strict";try{window.applicationCache.ondownloading=function(){parent.cacheInterface("ondownloading-theme")},window.applicationCache.onprogress=function(a){parent.cacheProgress(Math.round(100*(a.loaded/a.total)))},window.applicationCache.oncached=function(){parent.cacheInterface("oncached-theme")},window.applicationCache.onupdateready=function(){parent.cacheInterface("onupdateready-theme")},window.applicationCache.onnoupdate=function(){parent.cacheInterface("onnoupdate-theme")},window.applicationCache.onerror=function(){parent.cacheInterface("onerror-theme")},window.applicationCache.onobsolete=function(){parent.cacheInterface("onobsolete-theme")}}catch(a){parent.cacheInterface("onerror-theme")}</script></body></html>')

  # All Cacher
  with open(os.path.join(args.output, 'cache', 'all', 'index.html'), 'w+') as buf:
    buf.write('<!DOCTYPE html><html manifest="/cache/all/offline.manifest"><head><meta charset="utf-8"><title>Cacher</title></head><body><script>"use strict";try{window.applicationCache.ondownloading=function(){parent.cacheInterface("ondownloading")},window.applicationCache.onprogress=function(a){parent.cacheProgress(Math.round(100*(a.loaded/a.total)))},window.applicationCache.oncached=function(){parent.cacheInterface("oncached")},window.applicationCache.onupdateready=function(){parent.cacheInterface("onupdateready")},window.applicationCache.onnoupdate=function(){parent.cacheInterface("onnoupdate")},window.applicationCache.onerror=function(){parent.cacheInterface("onerror")},window.applicationCache.onobsolete=function(){parent.cacheInterface("onobsolete")}}catch(a){parent.cacheInterface("onerror")}</script></body></html>')

  # Category Cachers
  for category in menu:
    os.makedirs(os.path.join(args.output, 'cache', 'category', category))
    with open(os.path.join(args.output, 'cache', 'category', category, 'index.html'), 'w+') as buf:
      buf.write('<!DOCTYPE html><html manifest="/cache/category/' + category + '/offline.manifest"><head><meta charset="utf-8"><title>Cacher</title></head><body><script>"use strict";try{window.applicationCache.ondownloading=function(){parent.cacheInterface("ondownloading")},window.applicationCache.onprogress=function(a){parent.cacheProgress(Math.round(100*(a.loaded/a.total)))},window.applicationCache.oncached=function(){parent.cacheInterface("oncached")},window.applicationCache.onupdateready=function(){parent.cacheInterface("onupdateready")},window.applicationCache.onnoupdate=function(){parent.cacheInterface("onnoupdate")},window.applicationCache.onerror=function(){parent.cacheInterface("onerror")},window.applicationCache.onobsolete=function(){parent.cacheInterface("onobsolete")}}catch(a){parent.cacheInterface("onerror")}</script></body></html>')

    # Entry Cachers
    for entry in menu[category]['entries']:
      os.makedirs(os.path.join(args.output, 'cache', 'entry', category, entry))
      with open(os.path.join(args.output, 'cache', 'entry', category, entry, 'index.html'), 'w+') as buf:
        buf.write('<!DOCTYPE html><html manifest="/cache/entry/' + category + '/' + entry + '/offline.manifest"><head><meta charset="utf-8"><title>Cacher</title></head><body><script>"use strict";try{window.applicationCache.ondownloading=function(){parent.cacheInterface("ondownloading")},window.applicationCache.onprogress=function(a){parent.cacheProgress(Math.round(100*(a.loaded/a.total)))},window.applicationCache.oncached=function(){parent.cacheInterface("oncached")},window.applicationCache.onupdateready=function(){parent.cacheInterface("onupdateready")},window.applicationCache.onnoupdate=function(){parent.cacheInterface("onnoupdate")},window.applicationCache.onerror=function(){parent.cacheInterface("onerror")},window.applicationCache.onobsolete=function(){parent.cacheInterface("onobsolete")}}catch(a){parent.cacheInterface("onerror")}</script></body></html>')

  # --- Add Manifests ---------------------------------------------------------

  # Theme Manifest
  with open(os.path.join(args.output, 'themes.manifest'), 'w+') as buf:
    buf.write(getThemesManifest())

  # All Manifest
  with open(os.path.join(args.output, 'cache', 'all', 'offline.manifest'), 'w+') as buf:
    buf.write(getAllManifest())

  # Category Manifests
  for category in menu:
    with open(os.path.join(args.output, 'cache', 'category', category, 'offline.manifest'), 'w+') as buf:
      buf.write(getCategoryManifest(category))

    # Entry Manifests
    for entry in menu[category]['entries']:
      with open(os.path.join(args.output, 'cache', 'entry', category, entry, 'offline.manifest'), 'w+') as buf:
        buf.write(getEntryManifest(category, entry))

  # --- Cleanup ---------------------------------------------------------------

  # TODO: Delete all meta.json files

  # TODO: Delete all *.es6 files from theme's folder

  # TODO: Delete PUT EXPLOITS HERE file

  # TODO: Minify HTML, JS, and CSS

  print('\nDone!')


if __name__ == '__main__':
  main()

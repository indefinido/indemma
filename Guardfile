# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard 'bundler' do
  watch('Gemfile')
  # Uncomment next line if Gemfile contain `gemspec' command
  # watch(/^.+\.gemspec/)
end

guard 'coffeescript', :input => 'src', :output => '.', :bare => true
# Add files and commands to this file, like the example:
#   watch(%r{file/path}) { `command(s)` }
#
guard 'shell' do
  watch(/(.*).coffee/) { |m|
    puts '  Building tests component'
    puts `component build --name test --dev`

    puts '  Building development component'
    puts `component build --name development --dev`

    puts '  Building release component'
    puts `component build --name release`
  }

  watch(/component.json|lib\/observable/) { |m|
    puts '  Installing possible new components'
    puts `component install --dev`

    puts '  Building tests component'
    puts `component build --name test --dev`

    puts '  Building development component'
    puts `component build --name development --dev`

    puts '  Building release component'
    puts `component build --name release`
  }
end

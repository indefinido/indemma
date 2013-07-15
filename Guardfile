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
  watch(/src\/lib\/(.*).coffee/) { |m|
    puts '  Building release component'
    puts `component-build --verbose --name release`

    puts '  Building development component'
    puts `component-build --verbose --name development --dev`

    puts '  Building tests component'
    puts `component-build --verbose --name test --dev`
  }

  watch(/component.json/) { |m|
    puts '  Installing possible new components'
    puts `component install`

    puts '  Building release component'
    puts `component-build --verbose --name release`

    puts '  Building development component'
    puts `component-build --verbose --name development --dev`

    puts '  Building tests component'
    puts `component-build --verbose --name test`
  }
end

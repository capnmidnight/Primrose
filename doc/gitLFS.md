## Notes on Git LFS
When using Git LFS, you have to remember to replace most commands starting with `git` on the command line with `git lfs`, e.g.:

````
git checkout [Branch-Name] -> git lfs checkout [Branch-Name]
git clone [Repository-URL] -> git lfs [Repository-URL]
git fetch -> git lfs fetch
git pull -> git lfs pull
git push -> git lfs push
````

Additionally, there is a `git lfs status` command that provides additional information about the repository. It does not replace the standard `git status` command.

## Setup Git LFS for a new user
The following steps have to be done once per user.

### Install Git LFS
Go to [this site](https://git-lfs.github.com/) and install Git LFS.

### Clone an Existing Repository
For users joining an existing project, the `git lfs clone` function is fundamentally broken. Instead, you need to manually separate the process of cloning the repository and downloading the LFS-tracked objects.

````
git clone https://github.com/[User-Name]/[Project-Name].git
cd [Project-Name]
git lfs pull
````

### (Optional) disable locking.
If you don't have commit access to a repository, you'll probably need to disable LFS' lock.

````
git config 'lfs.https://github.com/[User-Name]/[Project-Name].git/info/lfs.locksverify'

### (Optional) for developers using Unity:
[Follow these instructions to find Unity's Yaml Merge tool](https://docs.unity3d.com/Manual/SmartMerge.html). Ignore the steps on configuring the tool for use with Git by directly editing the .git or .gitconfig file. Instead, use the command line.

````
git config --global merge.tool "unityyamlmerge"
git config --global mergetool.unityyamlmerge.cmd "'[Unity-Install-Directory]/Editor/Data/Tools/UnityYAMLMerge.exe' merge -p $BASE $REMOTE $LOCAL $MERGED"
git config --global mergetool.unityyamlmerge.trustexitcode "false"
````

Remembering to substitute `[User-Name]` and `[Project-Name]`. Your `[Unity-Install-Directory]` is likely to be `C:/Program Files/Unity`.
````

Finally, Unity projects have large files that--if configured correctly--exist as YAML-formatted text documents. If not configured correctly, they are a proprietary binary format that is impossible to Diff and Merge, so you might want to make sure text formatted assets are enabled.

[Follow these instructions to force enabling text assets for all assets](https://docs.unity3d.com/Manual/class-EditorManager.html). Also, you may want to [read more about text-formatted scenes](https://docs.unity3d.com/Manual/TextSceneFormat.html).

## Setup Git LFS for a new project
The following steps have to be done on a per-project basis. Once they are done by one user on a project, they don't have to be done by anyone else.

### Create the Git LFS hooks in the repo
Open your terminal and navigate to your project, then type:

````
git lfs install
````

### Create the .gitattributes file
Then in the same directory create the file `.gitattributes` and copy the contents:

````
*.cs diff=csharp text
*.shader text

## Unity
*.cginc text
*.mat merge=unityyamlmerge eol=lf
*.anim merge=unityyamlmerge eol=lf
*.unity merge=unityyamlmerge eol=lf
*.prefab merge=unityyamlmerge eol=lf
*.physicsMaterial2D merge=unityyamlmerge eol=lf
*.physicsMaterial merge=unityyamlmerge eol=lf
*.asset merge=unityyamlmerge eol=lf
*.meta merge=unityyamlmerge eol=lf
*.controller merge=unityyamlmerge eol=lf

##Image
*.jpg filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
*.png filter=lfs diff=lfs merge=lfs -text
*.gif filter=lfs diff=lfs merge=lfs -text
*.psd filter=lfs diff=lfs merge=lfs -text
*.ai filter=lfs diff=lfs merge=lfs -text
*.tif filter=lfs diff=lfs merge=lfs -text
*.tiff filter=lfs diff=lfs merge=lfs -text

##Audio
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.wav filter=lfs diff=lfs merge=lfs -text
*.ogg filter=lfs diff=lfs merge=lfs -text

##Video
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.mov filter=lfs diff=lfs merge=lfs -text
*.mpg filter=lfs diff=lfs merge=lfs -text
*.mpeg filter=lfs diff=lfs merge=lfs -text

##3D Object
*.FBX filter=lfs diff=lfs merge=lfs -text
*.fbx filter=lfs diff=lfs merge=lfs -text
*.blend filter=lfs diff=lfs merge=lfs -text
*.gltf filter=lfs diff=lfs merge=lfs -text
*.dae filter=lfs diff=lfs merge=lfs -text
*.obj filter=lfs diff=lfs merge=lfs -text
*.asset filter=lfs diff=lfs merge=lfs -text

##ETC
*.a filter=lfs diff=lfs merge=lfs -text
*.exr filter=lfs diff=lfs merge=lfs -text
*.tga filter=lfs diff=lfs merge=lfs -text
*.pdf filter=lfs diff=lfs merge=lfs -text
*.zip filter=lfs diff=lfs merge=lfs -text
*.dll filter=lfs diff=lfs merge=lfs -text
*.exe filter=lfs diff=lfs merge=lfs -text
*.apk filter=lfs diff=lfs merge=lfs -text
*.jar filter=lfs diff=lfs merge=lfs -text
*.unitypackage filter=lfs diff=lfs merge=lfs -text
*.aif filter=lfs diff=lfs merge=lfs -text
*.ttf filter=lfs diff=lfs merge=lfs -text
*.rns filter=lfs diff=lfs merge=lfs -text
*.reason filter=lfs diff=lfs merge=lfs -text
*.lxo filter=lfs diff=lfs merge=lfs -text
*.unity filter=lfs diff=lfs merge=lfs -text
*.7z filter=lfs diff=lfs merge=lfs -text
````

### Create the .gitignore file
And also these entries to your `.gitignore` file (creating one if you don't already have it):

````
## Unity

### These get regenerated at runtime
[Ll]ibrary/
[Ll]ibraries/

### Unity3D generated meta files
*.pidb.meta

### Unity3D Generated File On Crash Reports
sysinfo.txt


## Visual Studio

### User-specific files
*.suo
*.user
*.userosscache
*.sln.docstates
*.userprefs

### Build results
[Dd]ebug/
[Dd]ebugPublic/
[Rr]elease/
[Rr]eleases/
x64/
x86/
bld/
[Bb]in/
[Oo]bj/
[Ll]og/
[Tt]emp/
[Bb]uild/
[Bb]uilds/


## Visual Studio 2015 cache/options directory
.vs/

## MSTest test Results
[Tt]est[Rr]esult*/
[Bb]uild[Ll]og.*

## NUNIT
*.VisualState.xml
TestResult.xml

## Build Results of an ATL Project
[Dd]ebugPS/
[Rr]eleasePS/
dlldata.c

## DNX
project.lock.json
artifacts/

*_i.c
*_p.c
*_i.h
*.ilk
*.obj
*.pch
*.pdb
*.pgc
*.pgd
*.rsp
*.sbr
*.tlb
*.tli
*.tlh
*.tmp
*.tmp_proj
*.log
*.vspscc
*.vssscc
.builds
*.pidb
*.svclog
*.scc

## Visual C++ cache files
ipch/
*.aps
*.ncb
*.opendb
*.opensdf
*.sdf
*.cachefile
*.VC.db
*.VC.VC.opendb

## Visual Studio profiler
*.psess
*.vsp
*.vspx
*.sap

## TFS 2012 Local Workspace
$tf/

## Guidance Automation Toolkit
*.gpState

## Installshield output folder
[Ee]xpress/

## Click-Once directory
publish/

## Publish Web Output
*.[Pp]ublish.xml
*.azurePubxml
## TODO: Comment the next line if you want to checkin your web deploy settings
## but database connection strings (with potential passwords) will be unencrypted
*.pubxml
*.publishproj

## NuGet Packages
*.nupkg
## The packages folder can be ignored because of Package Restore
**/packages/*
## except build/, which is used as an MSBuild target.
!**/packages/build/
## Uncomment if necessary however generally it will be regenerated when needed
##!**/packages/repositories.config
## NuGet v3's project.json files produces more ignoreable files
*.nuget.props
*.nuget.targets

## Windows Store app package directories and files
AppPackages/
BundleArtifacts/
Package.StoreAssociation.xml
_pkginfo.txt

## Visual Studio cache files
## files ending in .cache can be ignored
*.[Cc]ache
## but keep track of directories ending in .cache
!*.[Cc]ache/

## Backup & report files from converting an old project file
## to a newer Visual Studio version. Backup files are not needed,
## because we have git ;-)
_UpgradeReport_Files/
Backup*/
UpgradeLog*.XML
UpgradeLog*.htm

## Microsoft Fakes
FakesAssemblies/

## Others
ClientBin/
~$*
*~
*.dbmdl
*.dbproj.schemaview
*.pfx
*.publishsettings
node_modules/
bower_components/
.ntvs_analysis.dat
orleans.codegen.cs
````
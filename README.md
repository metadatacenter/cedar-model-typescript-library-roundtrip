# CEDAR Model Typescript Library Roundtrip

## How to run
As of now, the `cedar-model-typescript-library` has not yet been published to npm.

You will need to build and link it locally.
Clone the [repo](https://github.com/metadatacenter/cedar-model-typescript-library), check out the `develop` branch, and then:

```shell
npm install
npm run build
npm run link
```
Then in this project you will use the project through a symlink:
```shell
npm install
npm link cedar-model-typescript-library
```


Run one of the files:
```shell
npx ts-node src/processExport.ts
```


import { IExecDataProtector } from "@iexec/dataprotector";
import { Connector } from "wagmi";

// const web3Provider = window.ethereum;
// // instantiate
// const dataProtector = new IExecDataProtector(web3Provider);


export const protectData = async (connector: Connector, data: any, name: string) => {
    const provider: any = await connector.getProvider()
    const dataProtector = new IExecDataProtector(provider);
    const protectedDataResult = await dataProtector.protectData({
        data,
        name: name
    });

    console.log("protectedDataResult: ", protectedDataResult)
    return protectedDataResult;

}

export const listProtectedData = async (connector: Connector, owner: any) => {
    console.log("listProtectedData: ")
    const provider: any = await connector.getProvider()
    const dataProtector = new IExecDataProtector(provider);

    const result = await dataProtector.fetchProtectedData({
        owner: owner,
        // requiredSchema: {
        //     email: 'string',
        //   },
    })
    console.log("result")
    console.log(result)
    return result
}


export const listGrantedAccess = async (connector: Connector, protectedData: any, owner: any) => {
    console.log("listGrantedAccess: ")
    const provider: any = await connector.getProvider()
    const dataProtector = new IExecDataProtector(provider);

    const result = await dataProtector.fetchGrantedAccess({
        protectedData: protectedData,
        authorizedApp: 'web3mail.apps.iexec.eth',
        authorizedUser: owner
    });
    console.log("result")
    console.log(result)
    return result
}

export const grantAccess = async (connector: Connector, protectedDataAddress: any, owner: any) => {
    console.log("grantAccess: ")
    console.log("protectedDataAddress: ", protectedDataAddress)
    const provider: any = await connector.getProvider()
    const dataProtector = new IExecDataProtector(provider);
    const result = await dataProtector.grantAccess({
        protectedData: protectedDataAddress,
        authorizedApp: 'web3mail.apps.iexec.eth',
        authorizedUser: owner
    });
    console.log("result: ", result)
    return result;
}

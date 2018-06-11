#ifndef tsdk_service_interface_h__
#define tsdk_service_interface_h__

#include "tsdk_def.h"

/**
 * [en]This enumeration is used to describe tup interface err.
 * [cn]tup�ӿڴ�����
 */
typedef enum tagTUP_E_SERVICE_IF_ERR
{
    TUP_E_SERVICE_OK = 0                    /**<[en]Indicates suces. <br>[cn]�ɹ� */
    ,TUP_E_SERVICE_MSGP_CREATE_ERR          /**<[en]Indicates message queue thread create failed. <br>[cn]��Ϣ�����߳�/���̴���ʧ�� */     
    ,TUP_E_SERVICE_TIMER_START_ERR          /**<[en]Indicates timer thread start failed. <br>[cn]��ʱ���߳�����ʧ�� */     
}TUP_E_SERVICE_IF_ERR;

/**
 * [en]This struct is used to describe initialize the parameters.
 * [cn]��ʼ�������ṹ��
 */
typedef struct tagTUP_S_INIT_PARAM
{
    TUP_BOOL with_ws_service;   /**<[en]init with websocket service. <br>[cn]�Ƿ�����websockets���� */
    TUP_BOOL with_wss;          /**<[en]init with wss for websocket. <br>[cn]�Ƿ�֧�� websockets wss����Э�� */
    TUP_CHAR *resource_path;    /**<[en]init with resource path for service. <br>[cn]���÷������Դ·�� */
    TUP_CHAR *log_path;         /**<[en]init with log path for service. <br>[cn]������־·�� */
    TUP_CHAR *cert_path;        /**<[en]init with wss cert path for service. <br>[cn]����wss֤��·�� */
    TUP_CHAR *lib_path;         /**<[en]init with lib path for service. <br>[cn]���ö�̬��·������̬����ʹ�� */
    TUP_CHAR *cert_file;        /**<[en]init with wss cert file for service. <br>[cn]����wss�����֤�� */
    TUP_CHAR *key_file;         /**<[en]init with wss key file for service. <br>[cn]����wss�����˽Կ */
    TUP_INT  ws_port;           /**<[en]init with port for ws service. <br>[cn]����ws����Ķ˿� */
    TUP_BOOL reserved;
} TUP_S_INIT_PARAM;

#ifdef __cplusplus
#if __cplusplus
extern "C" {
#endif
#endif

/**
 * @brief [en]This interface is used to startup tup service and set init parameters.
 *        <br>[cn]����TUP�������ó�ʼ������
 * 
 * @param [in] const TUP_S_INIT_PARAM* param         <b>:</b><br>[en]Indicates the initialization parameter.
 *                                                             <br>[cn]��ʼ������
 * @retval TUP_RESULT <b>:</b><br>[en]If it's success return TUP_SUCCESS, otherwise return the corresponding error code.
 *                            <br>[cn]�ɹ�����TUP_SUCCESS��ʧ�ܷ�����Ӧ������
 * 
 * @see NA
 **/
TUP_API TUP_RESULT tup_service_startup(TUP_S_INIT_PARAM *param);
/**
 * @brief [en]This interface is used to shutdown tup service.
 *        <br>[cn]ֹͣTUP���� 
 *                                                            
 * @retval TUP_RESULT <b>:</b><br>[en]If it's success return TUP_SUCCESS, otherwise return the corresponding error code.
 *                            <br>[cn]�ɹ�����TUP_SUCCESS��ʧ�ܷ�����Ӧ������
 * 
 * @see NA
 **/
TUP_API TUP_RESULT tup_service_shutdown();

/**
 * @brief [en]This interface is used to startup Deamon Service.
 *        <br>[cn]����TUP �������
 * 
 * @param [in] const TUP_S_INIT_PARAM* param         <b>:</b><br>[en]Indicates the initialization parameter.
 *                                                             <br>[cn]��ʼ������
 * @retval TUP_RESULT <b>:</b><br>[en]If it's success return TUP_SUCCESS, otherwise return the corresponding error code.
 *                            <br>[cn]�ɹ�����TUP_SUCCESS��ʧ�ܷ�����Ӧ������
 * 
 * @see NA
 **/
TUP_API int wsDeamonServiceStartUp(TUP_S_INIT_PARAM* param, int argc, char **argv);
/**
 * @brief [en]This interface is used to startup TUP Service Tray.
 *        <br>[cn]����TUPҵ���ػ�����tray
 * 
 * @param [in] const char* cmdline         <b>:</b><br>[en]Indicates the initialization parameter.
 *                                                             <br>[cn]��������
 * @retval TUP_RESULT <b>:</b><br>[en]If it's success return TUP_SUCCESS, otherwise return the corresponding error code.
 *                            <br>[cn]�ɹ�����TUP_SUCCESS��ʧ�ܷ�����Ӧ������
 * 
 * @see NA
 **/
TUP_API TUP_RESULT tup_service_deamon_startup(const char* cmdline);


#ifdef __cplusplus
#if __cplusplus
}
#endif
#endif

#endif // tsdk_service_interface_h__

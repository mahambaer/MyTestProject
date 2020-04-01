import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Card, Avatar, Text, Divider, Icon, Badge } from 'react-native-elements'
import ViewMoreText from 'react-native-view-more-text'

import styles from './../assets/styles'

renderViewMore = (onPress) => {
    return <Text onPress={onPress} style={styles.contentViewMoreText}>View More...</Text>
}

renderViewLess = (onPress) => {
    return <Text onPress={onPress} style={styles.contentViewMoreText}>View Less...</Text>
}

const PostCard = (props) => {
    return (
        props.onPress ?
            <TouchableOpacity
                onPress={props.onPress}
                activeOpacity={0.6}
            >
                <Card
                    title={
                        <View style={styles.postCardHeader}>
                            <View style={styles.postCardUser}>
                                <Avatar rounded icon={{ name: "account-circle" }} />
                                <View>
                                    <Text style={styles.postCardUserName}>{props.userName}</Text>
                                    <Text style={styles.postCardDate}>{props.date}</Text>
                                </View>
                            </View>
                        </View>
                    }
                >
                    <Divider style={styles.postCardDivider} />
                    <ViewMoreText
                        numberOfLines={3}
                        renderViewMore={renderViewMore}
                        renderViewLess={renderViewLess}
                    >
                        <Text>{props.content}</Text>
                    </ViewMoreText>
                    <Divider style={styles.postCardDivider} />
                    <View style={styles.postCardFooter}>
                        <View>
                            <Icon name="comment" color="grey" />
                            {!props.commentNumber ?
                                null
                                :
                                <Badge value={props.commentNumber} status="warning" containerStyle={styles.postCardBadge} />
                            }
                        </View>
                        <View>
                            <Icon name="thumb-up" color="grey" />
                            {!props.likeNumber ?
                                null
                                :
                                <Badge value={props.likeNumber} status="error" containerStyle={styles.postCardBadge} />
                            }
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
            :
            <Card
                title={
                    <View style={styles.postCardHeader}>
                        <View style={styles.postCardUser}>
                            <Avatar rounded icon={{ name: "account-circle" }} />
                            <View>
                                <Text style={styles.postCardUserName}>{props.userName}</Text>
                                <Text style={styles.postCardDate}>{props.date}</Text>
                            </View>
                        </View>
                    </View>
                }
            >
                <Divider style={styles.postCardDivider} />
                <ViewMoreText
                    numberOfLines={3}
                    renderViewMore={renderViewMore}
                    renderViewLess={renderViewLess}
                >
                    <Text>{props.content}</Text>
                </ViewMoreText>
                <Divider style={styles.postCardDivider} />
                <View style={styles.postCardFooter}>
                    <View>
                        <Icon name="comment" color="grey" />
                        {!props.commentNumber ?
                            null
                            :
                            <Badge value={props.commentNumber} status="warning" containerStyle={styles.postCardBadge} />
                        }
                    </View>
                    <View>
                        <Icon name="thumb-up" color="grey" />
                        {!props.likeNumber ?
                            null
                            :
                            <Badge value={props.likeNumber} status="error" containerStyle={styles.postCardBadge} />
                        }
                    </View>
                </View>
            </Card>
    )
}

export default PostCard
